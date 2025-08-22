import { Matrix3 } from "../math/matrix";
import { Vector2 } from "../math/vector";

export interface IGLResource {
  init(gl: WebGL2RenderingContext): void;
  deInit(): void;
}

export type GLAllowedValue = Matrix3 | Vector2;
export type GLAllowedType = typeof Matrix3 | typeof Vector2;