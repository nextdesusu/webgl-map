import { Matrix3 } from "../../math/matrix3";
import { Matrix4 } from "../../math/matrix4";
import { Vector2 } from "../../math/vector2";
import { Vector3 } from "../../math/vector3";
import { Texture } from "../texture";
import { GLTransferableType, GLTransferableValue } from "../types";

export function setUniform(
  gl: WebGL2RenderingContext,
  location: WebGLUniformLocation | null,
  type: GLTransferableType,
  value: GLTransferableValue
) {
  if (value instanceof Texture) {
    gl.uniform1i(location, value.channel);
    return
  }
  const array = value.array;
  switch (type) {
    case Matrix4:
      return gl.uniformMatrix4fv(location, false, array);
    case Matrix3:
      return gl.uniformMatrix3fv(location, false, array);
    case Vector3:
      return gl.uniform3f(location, array[0], array[1], array[2]!);
    case Vector2:
      return gl.uniform2f(location, array[0], array[1]);
  }
}

export function sizeByTransferableType(type: GLTransferableType) {
  switch (type) {
    case Matrix4:
      return 16;
    case Matrix3:
      return 9;
    case Vector3:
      return 3;
    case Vector2:
      return 2;
    default:
      throw Error("Unknown transferable type!");
  }
}

export function instantiateByTransferableType(type: GLTransferableType) {
  switch (type) {
    case Matrix4:
      return new Matrix4();
    case Matrix3:
      return new Matrix3();
    case Vector2:
      return new Vector2();
    case Vector3:
      return new Vector3();
    default:
      return null;
  }
}