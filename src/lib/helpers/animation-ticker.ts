import { AbstractTicker } from "./ticker";

export class AnimationTicker extends AbstractTicker {
  override stop() {
    if (this.process !== undefined) {
      window.cancelAnimationFrame(this.process);
    }
    this.process = undefined;
  }

  override start() {
    if (this.isTicking) {
      return;
    }
    this.plan();
  }

  override plan() {
    this.process = window.requestAnimationFrame(this.runTimer);
  }
}
