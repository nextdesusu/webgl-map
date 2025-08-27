
import { ensureGLOk } from "../error";
import { Shader } from "../shader/shader";
import { GLTransferableType, IAttribute, IGLLifeCycleSync, IProgram, IWebglOwner } from "../types";

export type ProgramProps = {
  fragment?: Shader;
  vertex?: Shader;
}

export class SimpleProgram implements IGLLifeCycleSync, IProgram {
  private _props: ProgramProps;
  private _program: WebGLProgram | null;
  changed: boolean;

  constructor(props: ProgramProps) {
    this._props = props;
    this._program = null;
    this.changed = true;
  }

  init(ctx: IWebglOwner): void {
    // Надо будет в этом месте находить все location
    const gl = ctx.gl;

    const program = gl.createProgram();
    const vertex = this._props.vertex;
    if (vertex) {
      vertex.init(ctx);
      ensureGLOk(gl);
      gl.attachShader(program, vertex.shader);
      ensureGLOk(gl);
    }

    const fragment = this._props.fragment;
    if (fragment) {
      fragment.init(ctx);
      ensureGLOk(gl);
      gl.attachShader(program, fragment.shader);
      ensureGLOk(gl);
    }

    gl.linkProgram(program);
    ensureGLOk(gl);
    this._program = program;
  }

  sync(ctx: IWebglOwner): void {

  }

  deInit(ctx: IWebglOwner): void {
    const gl = ctx.gl;

    const prog = this._program;
    if (!prog) {
      return
    }

    gl.deleteProgram(this._program);
    this._props.fragment?.deInit(ctx);
    this._props.vertex?.deInit(ctx);
    this._program = null;
  }

  setUniform(name: string, value: GLTransferableType) {

  }

  setAttribute(attribute: IAttribute): void {
    // const location = this._ensureAttributeLocation(attribute.name);

  }
}