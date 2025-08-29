import { AbstractTicker, TimeTickerCb } from "./ticker";

export class TimeTicker extends AbstractTicker {
  private tickPeriod: number;

  constructor(cb: TimeTickerCb, tickPeriod: number) {
    super(cb);
    this.tickPeriod = tickPeriod;
    this.lastRun = Date.now();
  }

  stop() {
    window.clearTimeout(this.process);
    this.process = undefined;
  }

  start() {
    if (this.isTicking) {
      return;
    }
    this.plan();
  }

  set tick(value: number) {
    this.tickPeriod = value;
  }

  get tick() {
    return this.tickPeriod;
  }

  override plan() {
    this.lastRun = Date.now();
    this.process = window.setTimeout(this.runTimer, this.tickPeriod);
  }
}
