import { RawShader } from "../types";
import { resolveIncludes } from "./includes";

export function processShaderSource(source: string): RawShader {
  const includes = resolveIncludes(source);
  return {
    ...includes,
    code: `#version 300 es\nprecision highp float;\n${includes.code}`,
  }
}