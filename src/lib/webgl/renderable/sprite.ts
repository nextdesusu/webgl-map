import { Texture } from "../texture";
import { IRenderable2D, IRenderContext } from "../types";
import { Transform2D } from "./transform";

export class Sprite implements IRenderable2D {
  private _texture: Texture;

  transform = new Transform2D();

  constructor(texture: Texture) {
    this._texture = texture;
  }

  render(ctx: IRenderContext): void {
    this._texture.use(ctx);
    
  }
}