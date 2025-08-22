import * as math from "gl-matrix";

export class Vector2 {
  private _inner: math.vec2 = math.vec2.create();

  get x() {
    return this._inner[0];
  }

  get y() {
    return this._inner[1];
  }
}