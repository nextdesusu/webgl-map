import * as math from "gl-matrix";
import { Writeable } from "./writeable";

export class Vector2 extends Writeable<math.vec2> {
  constructor(x = 0, y = 0) {
    super(math.vec2.set(math.vec2.create(), x, y));
  }

  get x() {
    return this._array[0];
  }

  get y() {
    return this._array[1];
  }
}