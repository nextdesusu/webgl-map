import { ensureGLOk } from "../error";
import { GLContextIsNotInit } from "../renderer/errors";
import { IGLResource } from "../types";

export type ProgramProps = {
  fragment?: string;
  vertex?: string;
}

export class Program implements IGLResource {
  private _gl: WebGL2RenderingContext | null;
  private _props: ProgramProps;
  private _program: WebGLProgram | null;

  constructor(props: ProgramProps) {
    this._gl = null;
    this._props = props;
    this._program = null;
  }

  private get gl() {
    const gl = this._gl;
    if (!gl) {
      throw new GLContextIsNotInit();
    }
    return gl;
  }

  init(gl: WebGL2RenderingContext): void {
    this._gl = gl;

    const program = gl.createProgram();
    if (this._props.vertex) {
      gl.attachShader(program, this._props.vertex);
    }

    if (this._props.fragment) {
      gl.attachShader(program, this._props.fragment);
    }

    gl.linkProgram(program);

    ensureGLOk(gl);
    this._program = program;
  }

  deInit(): void {

  }
}