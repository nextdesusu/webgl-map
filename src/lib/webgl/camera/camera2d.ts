import { Matrix3 } from "../../math/matrix3";

export class Camera2d {
  model = new Matrix3();
  view = new Matrix3();
  projection = new Matrix3();
}