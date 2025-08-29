import { Texture } from "../texture";
import { IProgram, IProgramInstance, IRenderable2D, IRenderContext } from "../types";
import { Transform2D } from "./transform";

export class Sprite implements IProgramInstance, IRenderable2D {
  private _texture: Texture;
  instanceIndex = -1;

  transform = new Transform2D();

  program: IProgram | null = null;

  constructor(texture: Texture) {
    this._texture = texture;
  }

  render(ctx: IRenderContext): void {
    this._texture.use();
  }
}

function createSpriteProgram() {
  
}