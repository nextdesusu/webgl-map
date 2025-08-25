export type TimeTickerCb = (ts: number) => void;

export abstract class AbstractTicker {
  protected process: number | undefined;
  protected cb: TimeTickerCb;
  protected lastRun: number;

  constructor(cb: TimeTickerCb) {
    this.cb = cb;
    this.lastRun = Date.now();
  }

  get isTicking() {
    return this.process !== undefined;
  }

  set callback(cb: TimeTickerCb) {
    this.cb = cb;
  }

  get callback() {
    return this.cb;
  }

  abstract plan(): void;

  protected runTimer = () => {
    if (this.isTicking) {
      const now = Date.now();
      const diff = now - this.lastRun;
      this.cb(diff);
      this.plan();

      this.lastRun = Date.now();
    }
  };

  abstract start(): void;

  abstract stop(): void;
}
