import { GLContextIsNotInit } from "./errors";

let gl: WebGL2RenderingContext | undefined;

export function getGL(): WebGL2RenderingContext {
  if (!gl) {
    throw new GLContextIsNotInit();
  }

  return gl;
}

export function setGL(nextGl: WebGL2RenderingContext) {
  gl = nextGl;
}

export class Renderer {
  private gl: WebGL2RenderingContext | undefined;

  
}