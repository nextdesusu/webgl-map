import { GrowableBuffer } from "../buffer/growable";
import { GLTransferableType, IAttribute, IProgram } from "../types";

export class BufferAttribute<Type extends GLTransferableType> implements IAttribute {
  private _name: string;
  private _type: Type;
  private _buffer: GrowableBuffer;

  constructor(name: string, type: Type, buffer: GrowableBuffer) {
    this._name = name;
    this._type = type;
    this._buffer = buffer;
  }

  get name(): string {
    return this._name;
  }

  get type(): GLTransferableType {
    return this._type;
  }
}