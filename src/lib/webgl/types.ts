import { Matrix3 } from "../math/matrix";
import { Vector2 } from "../math/vector";
import { TextureManager } from "./texture/manager";

export interface IGLResource {
  init(gl: WebGL2RenderingContext): void;
  deInit(): void;
}

export interface ITransform2D {
  applyParent(transform: ITransform2D): void;

  /**
   * Должно быть вызвано когда 
   */
  updated(): void;
  get matrix(): Matrix3;
}

export interface IRenderContext {
  gl: WebGL2RenderingContext;
  textureManager: TextureManager;
}

export interface IRenderable2D {
  render(ctx: IRenderContext): void;
  transform: ITransform2D;
}

export type GLAllowedValue = Matrix3 | Vector2;
export type GLAllowedType = typeof Matrix3 | typeof Vector2;


type ArgsType = Record<string, GLAllowedType>;

export type UniformMap = ArgsType;
export type AttributesMap = ArgsType;

export type RawShader = {
  uniforms?: UniformMap;
  attributes?: UniformMap;
  code: string;
}