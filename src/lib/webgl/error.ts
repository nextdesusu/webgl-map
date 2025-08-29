import { IWebglInfoLogger } from "./types";

export function ensureGLOk(gl: WebGL2RenderingContext, errorSource?: IWebglInfoLogger) {
  const error = gl.getError();

  if (error === gl.NO_ERROR) {
    return
  }

  const info = errorSource?.getWebglLog(gl);
  if (info) {
    throw Error(info);
  }

  // debugger
  throw Error(`WebGL2RenderingContext error = ${error}`);
}