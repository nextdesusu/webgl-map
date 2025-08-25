import { Matrix3 } from "../../math/matrix";
import { AttributesMap, GLAllowedType, RawShader, UniformMap } from "../types";

export const INCLUDES: Record<string, RawShader> = {
  camera: {
    code: "uniform mat3 u_model;\n" + "uniform mat3 u_view;\n" + "uniform mat3 u_projection;",
    uniforms: {
      model: Matrix3,
      view: Matrix3,
      projection: Matrix3,
    } as UniformMap,
  },
}

const INCLUDE_REGEXP = /#include \<(?<lib>.+)\>/;
export function resolveIncludes(shaderCode: string): RawShader {
  let attributes: AttributesMap | undefined = undefined;
  let uniforms: UniformMap | undefined = undefined

  return {
    code: shaderCode.replace(INCLUDE_REGEXP, (_match: any, lib: string) => {
      const library = INCLUDES[lib as keyof typeof INCLUDES];
      if (!library) {
        console.error("FAILED TO MATCH LIBRARY:", lib);
        return "";
      }

      if (library.attributes) {
        attributes = { ...attributes, ...library.attributes };
      }

      if (library.uniforms) {
        uniforms = { ...uniforms, ...library.uniforms };
      }
      return library.code;
    }),
    attributes,
    uniforms
  }
}