import { Matrix3 } from "../../math/matrix";
import { GLAllowedType } from "../types";

type AttributesAndUniforms = {
  uniforms?: Record<string, GLAllowedType>;
  attributes?: Record<string, GLAllowedType>;
}

export type Include = {
  code: string;
} & AttributesAndUniforms;

export const INCLUDES = {
  camera: {
    code: `
      uniform mat3 u_model;
      uniform mat3 u_view;
      uniform mat3 u_projection;
    `,
    uniforms: {
      model: Matrix3,
      view: Matrix3,
      projection: Matrix3,
    },
  } as Include,
}

const INCLUDE_REGEXP = /#include \<(?<lib>.+)\>/;
export function resolveIncludes(shaderCode: string) {
  const attributesAndUniforms: AttributesAndUniforms = {
    attributes: {},
    uniforms: {},
  };

  return {
    code: shaderCode.replace(INCLUDE_REGEXP, (_match: any, lib: string) => {
      const library = INCLUDES[lib as keyof typeof INCLUDES];
      if (!library) {
        console.error("FAILED TO MATCH LIBRARY:", lib);
        return "";
      }

      if (library.attributes) {
        attributesAndUniforms.attributes = { ...attributesAndUniforms.attributes, ...library.attributes };
      }

      if (library.uniforms) {
        attributesAndUniforms.uniforms = { ...attributesAndUniforms.uniforms, ...library.uniforms };
      }
      return library.code;
    }),
    attributesAndUniforms,
  }
}