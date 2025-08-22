import * as math from "gl-matrix";
import { Vector2 } from "./vector";

export class Matrix3 {
  // Column major??? непонятно
  private _mat3 = math.mat3.create();

  get array() {
    return this._mat3 as Float32Array;
  }

  setPosition(pos: Vector2) {
    
  }

  setScale(scale: Vector2) {

  }

  setRotation(rot: number) {
    
  }
}