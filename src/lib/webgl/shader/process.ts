import { resolveIncludes } from "./includes";

export function processShaderSource(source: string) {
  const includes = resolveIncludes(source);
  return {
    ...includes,
    code: `#version 300 es\n${includes.code}`,
  }
}