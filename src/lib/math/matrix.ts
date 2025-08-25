import * as math from "gl-matrix";
import { Vector2 } from "./vector";

export class Matrix3 {
  // Column major??? непонятно
  private _mat3 = math.mat3.create();

  get array() {
    return this._mat3 as Float32Array;
  }

  setPosition(pos: Vector2) {
    // Это не тот метод но пока хватит
    math.mat3.translate(this._mat3, this._mat3, pos.array);
    return this;
  }

  move(by: Vector2) {
    math.mat3.translate(this._mat3, this._mat3, by.array);
    return this;
  }

  setScale(scale: Vector2) {
    math.mat3.scale(this._mat3, this._mat3, scale.array);
    return this;
  }

  setRotation(rot: number) {
    math.mat3.rotate(this._mat3, this._mat3, rot);
    return this;
  }

  multiplyByMatrix3(by: Matrix3) {
    math.mat3.multiply(this._mat3, this._mat3, by.array);
    return this;
  }

  copy(src: Matrix3) {
    math.mat3.copy(this._mat3, src.array);
    return this;
  }
}