import { GrowableBuffer } from "../buffer/growable";
import { ensureGLOk } from "../error";
import { sizeByTransferableType } from "../transferable";
import { GLTransferableType, GLTransferableValue, IBufferAttribute, IGLLifeCycleSync, IWebglOwner } from "../types";

const GL_FLOAT = 5126;
const GL_STATIC_DRAW = 35044;

export class BufferAttribute<Type extends GLTransferableType> implements IBufferAttribute, IGLLifeCycleSync {
  private _name: string;
  private _type: Type;
  private _buffer: GrowableBuffer;
  private _vao: WebGLVertexArrayObject | null;
  private _glBuffer: WebGLBuffer | null;
  private _glBufferReallocated: boolean;
  private _location: number;

  attributeType = GL_FLOAT;
  usage = GL_STATIC_DRAW;

  constructor(name: string, type: Type, buffer: GrowableBuffer,) {
    this._name = name;
    this._type = type;
    this._buffer = buffer;
    this._vao = null;
    this._glBuffer = null;
    this._glBufferReallocated = false;
    this._location = -1;
  }

  changed = false;

  get name(): string {
    return this._name;
  }

  get type(): GLTransferableType {
    return this._type;
  }

  sync(ctx: IWebglOwner): void {
    if (this._glBufferReallocated) {
      this._glBufferReallocated = false;
      this.deleteVao(ctx.gl);
      this.createVao(ctx.gl);
      this.changed = true;
    }

    if (this.changed) {
      this.changed = false;
      this.syncDataBuffer(ctx.gl);
    }

    ctx.gl.bindVertexArray(this._vao);
  }

  init(ctx: IWebglOwner): void {
    this.createVao(ctx.gl);
  }

  deInit(ctx: IWebglOwner): void {
    this.deleteVao(ctx.gl);
  }

  setForProgram(gl: WebGL2RenderingContext, location: number): void {
    this._location = location;
  }

  set(index: number, value: GLTransferableValue): void {
    if (!(value instanceof this._type)) {
      throw Error("setting wrong value!");
    }

    this._glBufferReallocated = this._buffer.read((value as any).array, index);
  }

  private createVao(gl: WebGL2RenderingContext) {
    if (this._location === -1) {
      throw Error("Program is not set!");
    }
    const location = this._location;
    const size = sizeByTransferableType(this.type);
    const buffer = gl.createBuffer();
    const vao = gl.createVertexArray();
    this._glBuffer = buffer;
    this._vao = vao;

    gl.bindVertexArray(vao);
    this.syncDataBuffer(gl);

    gl.enableVertexAttribArray(location);
    ensureGLOk(gl);
    gl.vertexAttribPointer(location, size, this.attributeType, true, 0, 0);
    ensureGLOk(gl);
  }

  private syncDataBuffer(gl: WebGL2RenderingContext) {
    const buffer = this._glBuffer;
    const growable = this._buffer;
    const dataBuffer = growable.buffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    ensureGLOk(gl);
    gl.bufferData(gl.ARRAY_BUFFER, dataBuffer, this.usage, 0, growable.length);
    ensureGLOk(gl);
  }

  private deleteVao(gl: WebGL2RenderingContext) {
    gl.deleteBuffer(this._glBuffer);
    gl.deleteVertexArray(this._vao);
    this._glBuffer = null;
    this._vao = null;
  }
}