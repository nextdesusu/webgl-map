import { Matrix3 } from "../../math/matrix";
import { Vector2 } from "../../math/vector";

export class RenderBase {
  position = new Vector2();
  scale = new Vector2();
  rotation = 0;

  matrix = new Matrix3();

  updated() {
    this.matrix.setPosition(this.position);
    this.matrix.setScale(this.scale);
    this.matrix.setRotation(this.rotation);
  }
}