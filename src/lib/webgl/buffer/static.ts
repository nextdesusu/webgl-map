import { BufferLike } from "./types";

// const STATIC_DRAW = 35044;

export class StaticBuffer<T extends BufferLike = BufferLike> {
  protected _buffer: T;
  protected _type: number;

  // usage = STATIC_DRAW;

  constructor(src: T) {
    this._buffer = src;
    this._type = 0;
  }

  static f32(items: number[]) {
    return new this(new Float32Array(items));
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

  read(target: BufferLike, offset: number = 0) {
    const buffer = this._buffer;
    for (let i = 0; i < target.length; i++) {
      buffer[offset + i] = target[i];
    }
    return false;
  }

  // protected bindBuffer(gl: WebGL2RenderingContext) {
  //   const buff = gl.createBuffer();
  //   this._glBuffer = buff;
  //   this._needsRebind = false;
  // }

  // protected unbindBuffer(gl: WebGL2RenderingContext) {
  //   const glBuffer = this._glBuffer;
  //   if (!gl || !glBuffer) {
  //     return
  //   }

  //   gl.deleteBuffer(glBuffer);
  //   this._glBuffer = null;
  // }
}
