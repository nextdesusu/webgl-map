import { ensureGLOk } from "../error";
import { IGLLifeCycle, IWebglOwner } from "../types";
import { TexturePropsInner, TextureProps } from "./types";

const TEXTURE_2D = 3553;
/**
 * Хочу чтобы этот класс был примерно похож на тот что в pixi.js но не получается 
 */
export class Texture implements IGLLifeCycle {
  private _tex: WebGLTexture | null;
  private _props: TexturePropsInner;
  private _imageData: HTMLImageElement;

  constructor(imageData: HTMLImageElement, props?: TextureProps) {
    this._tex = null;
    this._props = normalizeTextureProps(props);
    this._imageData = imageData;
  }

  channel = TEXTURE_2D;

  get source() {
    return this._imageData;
  }

  init(ctx: IWebglOwner) {
    const gl = ctx.gl;
    const tex = gl.createTexture();
    this._tex = tex;

    this.use = () => {
      const textureChannel = this.channel;
      const props = this._props;

      gl.bindTexture(textureChannel, this._tex);
      gl.texParameteri(textureChannel, gl.TEXTURE_WRAP_S, props.wrapS);
      gl.texParameteri(textureChannel, gl.TEXTURE_WRAP_T, props.wrapT);
      gl.texParameteri(textureChannel, gl.TEXTURE_MIN_FILTER, props.minFilter);
      gl.texParameteri(textureChannel, gl.TEXTURE_MAG_FILTER, props.maxFilter);
      gl.texImage2D(
        textureChannel,
        props.mipmap,
        props.format,
        props.sourceFormat,
        props.sourceType,
        this._imageData,
      );
      ensureGLOk(gl);
    }
  }

  deInit(ctx: IWebglOwner) {
    const gl = ctx.gl;

    const tex = this._tex;
    if (!tex) {
      return
    }

    gl.deleteTexture(tex);
    this._tex = null;
  }

  use = noopFn;
}

const noopFn = Function.prototype as () => void;

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