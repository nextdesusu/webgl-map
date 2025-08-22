import * as math from "gl-matrix";

export class Vector2 {
  private _vec2: math.vec2 = math.vec2.create();

  get array() {
    return this._vec2 as Float32Array;
  }

  get x() {
    return this._vec2[0];
  }

  get y() {
    return this._vec2[1];
  }
}