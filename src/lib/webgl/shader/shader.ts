import { ensureGLOk } from "../error";
import { AttributeMap, IGLLifeCycle, IWebglOwner, RawShader, UniformMap } from "../types";
import { processShaderSource } from "./process";

const SHADER_FRAGMENT = 35632;
const SHADER_VERTEX = 35633;

type ShaderProps = {
  uniforms?: UniformMap;
  attributes?: AttributeMap;
}

export class Shader implements IGLLifeCycle {
  private _type: number;
  private _shader: WebGLShader | null;
  private _raw: RawShader;

  constructor(source: string, type: number, props?: ShaderProps) {
    this._raw = processShaderSource(source);
    if (props?.attributes) {
      this._raw.attributes = { ...this._raw.attributes, ...props.attributes };
    }
    if (props?.uniforms) {
      this._raw.uniforms = { ...this._raw.uniforms, ...props.uniforms };
    }
    this._type = type;
    this._shader = null;
  }

  static vertex(code: string, props?: ShaderProps) {
    return new Shader(code, SHADER_VERTEX, props);
  }

  static fragment(code: string, props?: ShaderProps) {
    return new Shader(code, SHADER_FRAGMENT, props);
  }

  get shader() {
    return this._shader!;
  }

  init(ctx: IWebglOwner): void {
    const gl = ctx.gl;

    this._shader = gl.createShader(this._type)!;
    ensureGLOk(gl);
    gl.shaderSource(this._shader, this._raw.code);
    ensureGLOk(gl);
  }

  deInit(ctx: IWebglOwner): void {
    const gl = ctx.gl;

    const shader = this._shader;
    if (!shader) {
      return
    }

    gl.deleteShader(shader);
    this._shader = null;
  }
}