import { GLContextIsNotInit } from "../renderer/errors";

export function ensureWebglInit(gl: WebGL2RenderingContext | null | undefined): WebGL2RenderingContext {
  if (!gl) {
    throw GLContextIsNotInit.instance;
  }

  return gl;
}