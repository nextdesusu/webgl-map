import { ArrayLike, IWriteableStructure } from "./types";

export class Writeable<T extends ArrayLike> implements IWriteableStructure {
  protected _array: T;

  constructor(array: T) {
    this._array = array;
  }

  writeSelf(target: ArrayLike, offset = 0): void {
    const self = this._array;
    for (let i = 0; i < self.length; i++) {
      target[i + offset] = self[i];
    }
  }

  get array() {
    return this._array;
  }

  get length(): number {
    return this._array.length;
  }

}