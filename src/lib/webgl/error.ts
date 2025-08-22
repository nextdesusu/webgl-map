export function ensureGLOk(gl: WebGL2RenderingContext) {
  const error = gl.getError();

  if (error === gl.NO_ERROR) {
    return
  }

  throw Error(`WebGL2RenderingContext error = ${error}`);
}