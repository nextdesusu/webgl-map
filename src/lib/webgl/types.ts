import { Matrix3 } from "../math/matrix3";
import { Matrix4 } from "../math/matrix4";
import { Vector2 } from "../math/vector2";
import { Vector3 } from "../math/vector3";
import { TextureManager } from "./texture/manager";

export interface IWebglOwner {
  get gl(): WebGL2RenderingContext;
}

export interface IGLLifeCycle {
  /**
   * Получение контекста
   * @param gl 
   */
  init(ctx: IWebglOwner): void;

  /**
   * Утрата контекста
   */
  deInit(ctx: IWebglOwner): void;
}

export interface IGLLifeCycleSync extends IGLLifeCycle {
  changed: boolean;
  sync(ctx: IWebglOwner): void;
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

export type GLTransferableType = Matrix4 | Matrix3 | Vector3 | Vector2;
export type GLAllowedValue = typeof Matrix4 | typeof Matrix3 | typeof Vector3 | typeof Vector2;

type ArgsType = Record<string, GLAllowedValue>;

export type UniformMap = ArgsType;
export type AttributeMap = ArgsType;

export type RawShader = {
  uniforms?: UniformMap;
  attributes?: AttributeMap;
  code: string;
}

export interface IAttribute {
  get name(): string;
  get type(): GLTransferableType;

  set(index: number, value: GLAllowedValue): void;
}

export interface IProgram {
  setAttribute(attribute: IAttribute): void;
}