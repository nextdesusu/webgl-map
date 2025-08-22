export interface IGLResource {
  init(gl: WebGL2RenderingContext): void;
  deInit(): void;
}