import { BufferAttribute } from "../attribute/buffer";
import { GrowableBuffer } from "../buffer/growable";
import { ensureGLOk } from "../error";
import { Shader } from "../shader/shader";
import { Texture } from "../texture";
import { instantiateByTransferableType, setUniform, sizeByTransferableType } from "../transferable";
import { AttributeMap, GLTransferableValue, GLTransferableValueWriteable, IGLLifeCycleSync, IProgram, IProgramInstance, IWebglInfoLogger, IWebglOwner, ProgramContext, UniformMap } from "../types";

export type ProgramProps = {
  fragment?: Shader;
  vertex?: Shader;
}

export class SimpleProgram implements IGLLifeCycleSync, IProgram, IWebglInfoLogger {
  private _props: ProgramProps;
  private _program: WebGLProgram | null;
  private _instances: IProgramInstance[];
  private _programContext: ProgramContext;
  private _locations: ProgramLocations | null;
  changed: boolean;

  constructor(props: ProgramProps) {
    this._props = props;
    this._program = null;
    this.changed = true;
    this._instances = [];
    this._programContext = createProgramContext(props.vertex, props.fragment);
    this._locations = null;
  }

  get instances(): readonly IProgramInstance[] {
    return this._instances;
  }

  get ctx(): Readonly<ProgramContext> {
    const ctx = this._programContext;
    if (!ctx) {
      throw Error("Program is not init!");
    }

    return ctx;
  }

  getWebglLog(gl: WebGL2RenderingContext): string | null {
    if (!this._program) {
      return null;
    }

    return gl.getProgramInfoLog(this._program);
  }

  init(ctx: IWebglOwner): void {
    // Надо будет в этом месте находить все location
    const gl = ctx.gl;

    const program = gl.createProgram();
    const vertex = this._props.vertex;
    if (vertex) {
      vertex.init(ctx);
      ensureGLOk(gl, this);
      gl.attachShader(program, vertex.shader);
      ensureGLOk(gl);
    }

    const fragment = this._props.fragment;
    if (fragment) {
      fragment.init(ctx);
      ensureGLOk(gl, this);
      gl.attachShader(program, fragment.shader);
      ensureGLOk(gl, this);
    }

    gl.linkProgram(program);
    ensureGLOk(gl, this);
    this._program = program;
    gl.useProgram(program);
    this._locations = getLocations(program, ctx, this._programContext);
    gl.useProgram(null);

    const attributeNames = this._programContext.attributesNames;
    if (attributeNames) {
      for (const attrName of attributeNames) {
        const loc = this._locations?.attributes?.[attrName];
        const buff = this._programContext.attributes?.[attrName];
        if (typeof loc === 'number' && buff) {
          buff.setForProgram(gl, loc);
        } else {
          throw Error("No location or no buffer!");
        }
      }
    }

    for (const lifecycle of this._programContext.lifeCycle) {
      lifecycle.init(ctx);
    }
  }

  sync(ctx: IWebglOwner): void {
    const program = this._program;
    if (!program) {
      return
    }
    const locations = this._locations;
    if (!locations) {
      return
    }
    const gl = ctx.gl;
    gl.useProgram(program);
    ensureGLOk(gl);

    const uniformNames = this._programContext.uniformNames;
    if (uniformNames) {
      for (const uniformName of uniformNames) {
        const location = locations.uniforms?.[uniformName];
        const uniformInfo = this._programContext.uniforms?.[uniformName];
        if (location && uniformInfo && uniformInfo.value) {
          setUniform(gl, location, uniformInfo.type, uniformInfo.value);
        }
      }
    }

    for (const lifecycle of this._programContext.lifeCycle) {
      lifecycle.sync(ctx);
    }

    ensureGLOk(gl);
  }

  deInit(ctx: IWebglOwner): void {
    const gl = ctx.gl;

    const prog = this._program;
    if (!prog) {
      return
    }

    for (const lifecycle of this._programContext.lifeCycle) {
      lifecycle.deInit(ctx);
    }

    gl.deleteProgram(this._program);
    this._props.fragment?.deInit(ctx);
    this._props.vertex?.deInit(ctx);
    this._program = null;
  }

  setAttribute(name: string, index: number, value: GLTransferableValue) {
    const attr = this._programContext.attributes?.[name];
    if (!attr) {
      return
    }

    attr.set(index, value);
  }

  setUniform(name: string, value: GLTransferableValue) {
    const uniforms = this._programContext.uniforms;
    if (!uniforms) {
      return
    }

    if (value instanceof Texture) {
      uniforms[name].value = value;
    } else {
      const target = uniforms[name]?.value as GLTransferableValueWriteable;

      if (!target) {
        console.error(`setting uniform with name=${name} failed, no such uniform found!`);
        return
      }
      target.copyFromArray(value.array);
    }
  }
}

function createProgramContext(vertShader: Shader | undefined, fragShader: Shader | undefined): ProgramContext {
  const ctx: ProgramContext = {
    lifeCycle: [],
  };

  if (vertShader) {
    if (vertShader.attributes) {
      addAttributes(vertShader.attributes);
    }

    if (vertShader.uniforms) {
      addUniforms(vertShader.uniforms);
    }
  }

  if (fragShader) {
    if (fragShader.attributes) {
      addAttributes(fragShader.attributes);
    }

    if (fragShader.uniforms) {
      addUniforms(fragShader.uniforms);
    }
  }

  function addAttributes(attrs: AttributeMap) {
    if (!ctx.attributes) {
      ctx.attributes = {};
    }
    for (const attrName of Object.keys(attrs)) {
      if (attrName in ctx.attributes) {
        throw Error(`Have two or more attributes with the same name! ${attrName}`);
      }

      const attrType = attrs[attrName];
      const size = sizeByTransferableType(attrType);
      const buff = new BufferAttribute(attrName, attrType, GrowableBuffer.f32WithCapacity(size * 10));
      ctx.lifeCycle.push(buff);
      ctx.attributes[attrName] = buff;
    }
  }

  function addUniforms(uniforms: UniformMap) {
    if (!ctx.uniforms) {
      ctx.uniforms = {};
    }
    for (const uniformName of Object.keys(uniforms)) {
      if (uniformName in ctx.uniforms) {
        throw Error(`Have two or more uniforms with the same name! ${uniformName}`);
      }

      const uniformType = uniforms[uniformName];

      ctx.uniforms[uniformName] = {
        type: uniformType,
        value: instantiateByTransferableType(uniformType),
      }
    }
  }

  if (ctx.attributes) {
    ctx.attributesNames = Object.keys(ctx.attributes);
  }

  if (ctx.uniforms) {
    ctx.uniformNames = Object.keys(ctx.uniforms);
  }
  return ctx;
}

function getLocations(program: WebGLProgram, webglCtx: IWebglOwner, programCtx: ProgramContext): ProgramLocations {
  const locations: ProgramLocations = {};
  const gl = webglCtx.gl;

  const attrs = programCtx.attributes;
  if (attrs) {
    if (!locations.attributes) {
      locations.attributes = {};
    }
    for (const attrName of Object.keys(attrs)) {
      const location = gl.getAttribLocation(program, attrName);
      if (location === -1) {
        throw Error(`Failed to find attribute ${attrName}`);
      }
      locations.attributes[attrName] = location;
    }
  }

  const uniforms = programCtx.uniforms;
  if (uniforms) {
    if (!locations.uniforms) {
      locations.uniforms = {};
    }
    for (const uniformName of Object.keys(uniforms)) {
      // const location = gl.getUniformLocation(program, uniformName);
      // locations.uniforms[uniformName] = location;
    }
  }

  return locations;
}

type ProgramLocations = {
  attributes?: Record<string, number>;
  uniforms?: Record<string, WebGLUniformLocation | null>;
}
