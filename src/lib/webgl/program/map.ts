import { Matrix3 } from "../../math/matrix3";
import { Vector2 } from "../../math/vector2";
import { GLTransferableType, GLTransferableValue } from "../types";


type Entry<T, State = any> = {
  setter: (item: T, state: State, gl: WebGL2RenderingContext) => void;
  state: State,
}

export class BaseMap {
  private _added: Map<string, Entry<any>> = new Map();

  addEntry(name: string, value: GLTransferableValue) {
    const entry: Entry<any> = {
      setter: this.getSetter(value),
      state: this.createDefaultState(value),
    }

    this._added.set(name, entry);
  }

  apply() {
    for (const [name, value] of this._added.entries()) {
      
    }
  }

  private createDefaultState(t: GLTransferableValue) {
    if (t instanceof Matrix3) {
      // const buff = 
      // return {

      // }
    }

    return null;
  }

  private getSetter(t: GLTransferableValue): Entry<any>['setter'] {
    if (t instanceof Matrix3) {
      return setMatrix;
    }

    if (t instanceof Vector2) {

    }

    return invalidSetter;
  }
}

type Matrix3State = {
  array: Float32Array
}

const setMatrix: Entry<Matrix3, Matrix3State>['setter'] = (item, state, gl) => {
  
}

const invalidSetter: Entry<any>['setter'] = (item, state, gl) => {
  console.error("Failed to set", item, "since setter is invalid!");
}