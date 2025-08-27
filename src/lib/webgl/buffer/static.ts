import { IGLLifeCycleSync, IWebglOwner } from "../types";
import { BufferLike } from "./types";

const STATIC_DRAW = 35044;

export class StaticBuffer<T extends BufferLike = BufferLike> implements IGLLifeCycleSync {
  protected _buffer: T;
  protected _glBuffer: WebGLBuffer | null;
  protected _needsRebind: boolean;
  protected _type: number;

  usage = STATIC_DRAW;
  
  changed: boolean;
  constructor(src: T) {
    this._buffer = src;
    this.changed = false;
    this._needsRebind = true;
    this._glBuffer = null;
    this._type = 0;
  }

  static f32(items: number[]) {
    return new StaticBuffer(new Float32Array(items));
  }

  init(ctx: IWebglOwner): void {
    this.bindBuffer(ctx.gl);
  }

  deInit(ctx: IWebglOwner): void {
    this.unbindBuffer(ctx.gl);
  }

  get capacity() {
    return this._buffer.length;
  }

  get length() {
    return this._buffer.length;
  }

  get buffer() {
    return this._buffer;
  }

  get maxIndex() {
    return this.length - 1;
  }

  swap(i: number, j: number) {
    const maxIndex = this.maxIndex;
    if (i > maxIndex || j > maxIndex) {
      return
    }

    const tmp = this._buffer[i];
    this._buffer[i] = this._buffer[j];
    this._buffer[j] = tmp;
  }

  sync(ctx: IWebglOwner) {
    const gl = ctx.gl;
    const buff = this._glBuffer;
    if (!this.changed || !buff || !gl) {
      return
    }

    if (this._needsRebind) {
      this.unbindBuffer(gl);
      this.bindBuffer(gl);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buff);
    gl.bufferData(gl.ARRAY_BUFFER, this._buffer, this.usage, 0, this.length);
  }

  write(target: BufferLike, offset: number = 0) {
    for (let i = offset; i < target.length; i++) {
      this._buffer[i] = target[i];
    }
  }

  protected bindBuffer(gl: WebGL2RenderingContext) {
    const buff = gl.createBuffer();
    this._glBuffer = buff;
    this._needsRebind = false;
  }

  protected unbindBuffer(gl: WebGL2RenderingContext) {
    const glBuffer = this._glBuffer;
    if (!gl || !glBuffer) {
      return
    }

    gl.deleteBuffer(glBuffer);
    this._glBuffer = null;
  }
}
