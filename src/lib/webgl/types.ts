import { Matrix3 } from "../math/matrix3";
import { Matrix4 } from "../math/matrix4";
import { Vector2 } from "../math/vector2";
import { Vector3 } from "../math/vector3";
import { Texture } from "./texture";
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

export type GLTransferableValueWriteable = Matrix4 | Matrix3 | Vector3 | Vector2;
export type GLTransferableValue = GLTransferableValueWriteable | Texture;
export type GLTransferableTypeWriteable = typeof Matrix4 | typeof Matrix3 | typeof Vector3 | typeof Vector2;
export type GLTransferableType = GLTransferableTypeWriteable | typeof Texture;

type ArgsType = Record<string, GLTransferableType>;

export type UniformMap = ArgsType;
export type AttributeMap = ArgsType;

export type RawShader = {
  uniforms?: UniformMap;
  attributes?: AttributeMap;
  code: string;
}

export interface IBufferAttribute {
  get name(): string;
  get type(): GLTransferableType;

  set(index: number, value: GLTransferableValue): void;
  setForProgram(gl: WebGL2RenderingContext, location: number): void;
}

export type UniformInfo = {
  type: GLTransferableType,
  value: GLTransferableValue | null,
}

export type ProgramContext = {
  attributes?: Record<string, IBufferAttribute>,
  uniforms?: Record<string, UniformInfo>,

  uniformNames?: string[];
  attributesNames?: string[];

  lifeCycle: IGLLifeCycleSync[];
}

export interface IProgramInstance {
  instanceIndex: number;

  program: IProgram | null;
}

export interface IProgram {
  get instances(): ReadonlyArray<IProgramInstance>;
  get ctx(): Readonly<ProgramContext>;
}

export interface IWebglInfoLogger {
  getWebglLog(gl: WebGL2RenderingContext): string | null;
}