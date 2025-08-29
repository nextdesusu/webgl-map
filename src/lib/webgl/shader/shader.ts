import { ensureGLOk } from "../error";
import { AttributeMap, IGLLifeCycle, IWebglInfoLogger, IWebglOwner, RawShader, UniformMap } from "../types";
import { processShaderSource } from "./process";

const SHADER_FRAGMENT = 35632;
const SHADER_VERTEX = 35633;

type ShaderProps = {
  uniforms?: UniformMap;
  attributes?: AttributeMap;
}

export class Shader implements IGLLifeCycle, IWebglInfoLogger {
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

  get uniforms() {
    return this._raw.uniforms;
  }

  get attributes() {
    return this._raw.attributes;
  }

  get shader() {
    return this._shader!;
  }

  getWebglLog(gl: WebGL2RenderingContext): string | null {
    if (!this._shader) {
      return null;
    }

    return gl.getShaderInfoLog(this._shader);
  }

  init(ctx: IWebglOwner): void {
    const gl = ctx.gl;

    const shader = this._shader = gl.createShader(this._type);
    if (!shader) {
      throw Error("Failed to create shader!");
    }
    ensureGLOk(gl, this);
    gl.shaderSource(shader, this._raw.code);
    ensureGLOk(gl, this);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      this.deInit(ctx);
      throw Error(formatShaderErrorMessage(this._raw.code, this._type, log));
    }
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

function formatShaderErrorMessage(source: string, type: number, errorText: string | null) {
  const buffer = [
    `shader error of shader type = ${type}`,
    enhanceSource(source),
  ]
  if (errorText) {
    buffer.push(errorText);
  }

  return buffer.join("\n");
}

function enhanceSource(source: string) {
  const lines = source.split("\n");
  const padCount = String(lines.length).length;
  return lines.map((line, index) => {
    return `${String(index).padStart(padCount, '0')}: ${line}`
  }).join("\n")
}