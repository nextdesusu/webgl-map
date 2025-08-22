import { Texture } from "../texture";
import { RenderBase } from "./base";

export class Sprite extends RenderBase {
  private _tex: Texture;
  constructor(tex: Texture) {
    super();
    
    this._tex = tex;
  }
}