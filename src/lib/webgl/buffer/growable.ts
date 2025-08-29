import { StaticBuffer } from "./static";
import { BufferLike } from "./types";

type BufferFactory<T extends BufferLike> = (size: number) => T;

type GrowableBufferSrc<T extends BufferLike> = BufferFactory<T> | T;

const CONSTRUCTORS = new Map([
  Float64Array,
  Float32Array,
  Int32Array,
  Int16Array,
  Int8Array,
  Uint32Array,
  Uint16Array,
  Uint8Array,
  Uint8ClampedArray,
].map((target) => [target, (size: number) => new target(size)]));

const NULL_BUFFER_LENGTH = 10;

export class GrowableBuffer<T extends BufferLike = BufferLike> extends StaticBuffer<T> {
  private _factory: BufferFactory<T>;
  private _idx: number;

  constructor(src: GrowableBufferSrc<T>, initialCapacity: number = NULL_BUFFER_LENGTH) {
    let factory: BufferFactory<T>;
    let buffer: T;
    let idx = 0;
    if (typeof src === 'function') {
      factory = src;
      buffer = factory(initialCapacity);
    } else {
      const ctor = Reflect.getPrototypeOf(src)?.constructor;
      if (!ctor) {
        throw Error("Buffer is not valid");
      }

      const got = CONSTRUCTORS.get(ctor as any);
      if (!got) {
        throw Error("Buffer is not valid");
      }
      factory = got as BufferFactory<T>;
      buffer = src;
      idx = src.length - 1;
    }

    super(buffer);

    this._idx = idx;
    this._factory = factory;
  }

  static f32WithCapacity(capacity: number) {
    return new GrowableBuffer<Float32Array>(f32Buffer, capacity);
  }

  override get length() {
    return this._idx;
  }

  /**
   * 
   * @returns Был ли буфер реаллоцирован в результате операции
   */
  push(item: number) {
    const reallocated = this.reallocateIfNeeded(this.length + 1);
    this._buffer[this._idx++] = item;
    return reallocated;
  }

  deleteItemAt(idx: number) {
    if (idx > this.maxIndex || this._idx === 0) {
      return
    }
    const buff = this._buffer;

    for (let i = idx, j = idx + 1; i++; i < this.length && j < this.length) {
      buff[i] = j;
    }
    this._idx--;
  }

  override read(target: BufferLike, offset = 0) {
    const totalLength = target.length + offset;
    const reallocated = this.reallocateIfNeeded(totalLength);
    super.read(target, offset);
    return reallocated;
  }

  private reallocateIfNeeded(nextLength: number) {
    let reallocated = false;
    const cap = this.capacity;
    if (shouldGrow(nextLength, cap)) {
      const oldBuffer = this._buffer;
      const newBuffer = this._factory(nextLength * 2);
      for (let i = 0; i < this.length; i++) {
        const item = oldBuffer[i];
        newBuffer[i] = item;
      }
      this._buffer = newBuffer;
      reallocated = true;
    } else if (shouldShrink(nextLength, cap)) {

    }

    return reallocated;
  }
}

function shouldGrow(length: number, capacity: number) {
  return length > capacity;
}

function shouldShrink(length: number, capacity: number) {
  return Math.floor(capacity * 0.25) > length;
}

function f32Buffer(size: number) {
  return new Float32Array(size);
}