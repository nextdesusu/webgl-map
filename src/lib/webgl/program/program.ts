import { Matrix3 } from "../../math/matrix";
import { ensureGLOk } from "../error";
import { Shader } from "../shader/shader";
import { GLAllowedValue, IGLResource } from "../types";

export type ProgramProps = {
  fragment?: Shader;
  vertex?: Shader;
}

export class SimpleProgram implements IGLResource {
  private _gl: WebGL2RenderingContext | null;
  private _props: ProgramProps;
  private _program: WebGLProgram | null;

  constructor(props: ProgramProps) {
    this._gl = null;
    this._props = props;
    this._program = null;
  }

  init(gl: WebGL2RenderingContext): void {
    this._gl = gl;

    const program = gl.createProgram();
    const vertex = this._props.vertex;
    if (vertex) {
      vertex.init(gl);
      gl.attachShader(program, vertex.shader);
      ensureGLOk(gl);
    }

    const fragment = this._props.fragment;
    if (fragment) {
      fragment.init(gl);
      gl.attachShader(program, fragment.shader);
      ensureGLOk(gl);
    }

    gl.linkProgram(program);
    ensureGLOk(gl);
    this._program = program;
  }

  use() {

  }

  setUniform(name: string, value: GLAllowedValue) {
    const gl = this._gl;
    if (!gl || !this._program) {
      console.error("program is not init!");
      return
    }
    const location = gl.getUniformLocation(this._program, name);
    if (location === null) {
      console.error("failed to get location by name:", name);
      return
    }

    // if (value instanceof Matrix3) {

    // }
  }

  setAttribute(name: string, value: GLAllowedValue) {
    
  }

  deInit(): void {
    const gl = this._gl;
    if (!gl) {
      return
    }

    const prog = this._program;
    if (!prog) {
      return
    }

    gl.deleteProgram(this._program);
    this._props.fragment?.deInit();
    this._props.vertex?.deInit();
    this._program = null;
    this._gl = null;
  }
}