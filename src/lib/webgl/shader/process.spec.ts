import { processShaderSource } from "./process";

describe("processShaderSource", () => {
  it("Correctly resolves camera include", () => {
    const shaderCode = `#include <camera>

  void main() {}
  `;

    const shaderResult = `#version 300 es
uniform mat3 u_model;
uniform mat3 u_view;
uniform mat3 u_projection;

  void main() {}
  `;

    const shader = processShaderSource(shaderCode);
    expect(shader.code).toBe(shaderResult)
  });
})