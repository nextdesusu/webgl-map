export class MapRender {
  private constructor(private readonly canvas: HTMLCanvasElement, private ctx: WebGL2RenderingContext) {}

  // RAII 😎😎😎
  static async capture(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("webgl2");
    if (!ctx) {
      throw Error("Failed to capture webgl2 context!");
    }

    const render = new MapRender(canvas, ctx);

    await render.init();

    return render;
  }

  private async init() {

  }
}