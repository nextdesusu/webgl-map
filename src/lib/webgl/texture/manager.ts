import { TIME } from "../../helpers/time";
import { TimeTicker } from "../../helpers/time-ticker";
import { Texture } from "./texture";

type TextureLastUsedTS = number;

const MAX_UNUSED_TIME = TIME.MINUTE * 2;
export class TextureManager {
  private _textures: Map<Texture, TextureLastUsedTS>;
  private _ticker: TimeTicker;

  static singleton = new TextureManager();

  constructor() {
    this._textures = new Map();
    this._ticker = new TimeTicker(this.cleanUnused, TIME.SECOND * 10);
  }

  start() {
    this._ticker.start();
  }

  stop() {
    this._ticker.stop();
  }

  useTexture(texture: Texture) {
    this._textures.set(texture, Date.now());
  }

  removeTexture(texture: Texture) {
    if (!this._textures.has(texture)) {
      return;
    }

    texture.deInit();
    this._textures.delete(texture);
  }

  private cleanUnused = () => {
    const now = Date.now();
    const deleteCandidates: Texture[] = [];
    for (const entry of this._textures) {
      if (now - entry[1] > MAX_UNUSED_TIME) {
        deleteCandidates.push(entry[0]);
      }
    }

    for (const toDelete of deleteCandidates) {
      this.removeTexture(toDelete);
    }
  }
}