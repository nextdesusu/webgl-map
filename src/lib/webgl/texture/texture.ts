
import { ensureGLOk } from "../error";
import { GLContextIsNotInit } from "../renderer/errors";
import { IGLResource, IRenderContext } from "../types";
import { TextureManager } from "./manager";
import { TexturePropsInner, TextureProps } from "./types";


/**
 * Хочу чтобы этот класс был примерно похож на тот что в pixi.js но не получается 
 */
export class Texture implements IGLResource {
  private _tex: WebGLTexture | null;
  private _props: TexturePropsInner;
  private _imageData: HTMLImageElement;

  /**
   * Устанавливается рендерером
   */
  private _gl: WebGL2RenderingContext | null;

  constructor(imageData: HTMLImageElement, props?: TextureProps) {
    this._gl = null;
    this._tex = null;
    this._props = normalizeTextureProps(props);
    this._imageData = imageData;
  }

  private get gl() {
    const gl = this._gl;
    if (!gl) {
      throw GLContextIsNotInit.instance;
    }
    return gl;
  }

  get source() {
    return this._imageData;
  }

  use(ctx: IRenderContext) {
    if (!this._gl) {
      this.init(ctx.gl);
    }
    
    ctx.textureManager.useTexture(this);
  }

  init(gl: WebGL2RenderingContext) {
    this.deInit();
    const tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    ensureGLOk(gl);
    this._tex = tex;
  }

  deInit() {
    const gl = this._gl;
    if (!gl) {
      return
    }

    const tex = this._tex;
    if (!tex) {
      return
    }

    gl.deleteTexture(tex);
    this._tex = null;
    this._gl = null;
  }

  doInit() {
    const gl = this.gl;

    gl.bindTexture(gl.TEXTURE_2D, this._tex);
    gl.texImage2D(
      gl.TEXTURE_2D,
      this._props.mipmap,
      this._props.format,
      this._props.sourceFormat,
      this._props.sourceType,
      this._imageData,
    );
  }
}

function normalizeTextureProps(incoming?: TextureProps): TexturePropsInner {
  const props = defaultProps;

  if (!incoming) {
    return { ...props };
  }

  // Все это не очень производительно зато удобно!
  const out: TextureProps = Object.create(null);
  for (const key of Object.keys(props) as (keyof TextureProps)[]) {
    const ownValue = incoming[key];
    const defaultValue = incoming[key];
    const value = typeof ownValue === 'undefined' ? defaultValue : ownValue;
    out[key] = value;
  }

  return out as TexturePropsInner;
}

const RGBA = 6408;
const UNSIGNED_BYTE = 5121;
const CLAMP_TO_EDGE = 33071;
const LINEAR = 9729;
const defaultProps = {
  mipmap: 0,
  format: RGBA,
  sourceFormat: RGBA,
  sourceType: UNSIGNED_BYTE,

  wrapS: CLAMP_TO_EDGE,
  wrapT: CLAMP_TO_EDGE,
  minFilter: LINEAR,
  maxFilter: LINEAR,
}