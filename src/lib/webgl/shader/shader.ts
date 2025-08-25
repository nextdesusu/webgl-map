import { ensureGLOk } from "../error";
import { GLContextIsNotInit } from "../renderer/errors";
import { IGLResource, RawShader } from "../types";
import { processShaderSource } from "./process";

export class Shader implements IGLResource {
  private _type: number;
  private _shader: WebGLShader | null;
  private _gl: WebGL2RenderingContext | null;
  private _raw: RawShader;

  constructor(source: string, type: number) {
    this._raw = processShaderSource(source);
    this._type = type;
    this._shader = null;
    this._gl = null;
  }

  static vertex(code: string) {
    return new Shader(code, 35633);
  }

  static fragment(code: string) {
    return new Shader(code, 35632);
  }

  get shader() {
    return this._shader!;
  }

  private get gl() {
    const gl = this._gl;
    if (!gl) {
      throw GLContextIsNotInit.instance;
    }

    return gl;
  }

  init(gl: WebGL2RenderingContext): void {
    this.deInit();

    this._gl = gl;

    this._shader = gl.createShader(this._type)!;
    gl.shaderSource(this._shader, this._raw.code);
    ensureGLOk(gl);
  }

  deInit(): void {
    const gl = this._gl;
    if (!gl) {
      return
    }

    const shader = this._shader;
    if (!shader) {
      return
    }

    gl.deleteShader(shader);
    this._shader = null;
  }

}