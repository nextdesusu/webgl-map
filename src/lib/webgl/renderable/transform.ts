import { Matrix3 } from "../../math/matrix3";
import { Vector2 } from "../../math/vector2";
import { ITransform2D } from "../types";

// const _mat3 = new Matrix3();

export class Transform2D implements ITransform2D {
  position = new Vector2();
  scale = new Vector2();
  rotation = 0;

  matrix = new Matrix3();

  applyParent(parent: ITransform2D): void {
    this.matrix.multiplyByMatrix3(parent.matrix);
  }

  updated() {
    this.matrix.setPosition(this.position);
    this.matrix.setScale(this.scale);
    this.matrix.setRotation(this.rotation);
  }
} 