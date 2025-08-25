import { Container } from "../renderable/container";
import { TextureManager } from "../texture/manager";
import { IRenderContext } from "../types";

export class Renderer {
  private _canvas: HTMLCanvasElement;
  private _gl: WebGL2RenderingContext;
  private _scene: Container;
  private _ctx: IRenderContext;

  constructor(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext("webgl2")!;
    this._gl = gl;
    this._canvas = canvas;
    this._scene = new Container();
    this._ctx = {
      gl,
      textureManager: new TextureManager(),
    }
  }

  get gl() {
    return this._gl;
  }

  render() {
    const canvas = this._canvas;
    const gl = this._gl;

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);

    this._scene.render(this._ctx);
  }
}