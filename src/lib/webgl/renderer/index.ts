


export class Renderer {
  private canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext;

  constructor(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext("webgl2");
    this.gl = gl!;
    this.canvas = canvas;
  }

  
}