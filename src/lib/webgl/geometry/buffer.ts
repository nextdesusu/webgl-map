import { BufferAttribute } from "../attribute/buffer";
import { GrowableBuffer } from "../buffer/growable";
import { StaticBuffer } from "../buffer/static";

type Vertices = Float32Array | number[]
type Indices = Int16Array | number[];

const NULL_INDICES = new StaticBuffer(new Int16Array([]));

export class BufferGeometry {
  private _vertices: StaticBuffer<Float32Array>;
  private _indices: StaticBuffer<Int16Array>;
  private _attributes: Record<string, BufferAttribute<any>>;

  constructor(vertices: Vertices, indices?: Indices) {
    this._vertices = new StaticBuffer(vertices instanceof Float32Array ? vertices : new Float32Array(vertices));
    this._indices = indices ? new StaticBuffer(indices instanceof Int16Array ? indices : new Int16Array(indices)) : NULL_INDICES;
    this._attributes = {};
  }

  get vertices() {
    return this._vertices;
  }

  get indices() {
    return this._indices;
  }
}