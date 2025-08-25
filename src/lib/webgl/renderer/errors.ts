export class GLContextIsNotInit extends Error {
  constructor() {
    super("GL context is not init for application!");
  }

  static instance = new GLContextIsNotInit();
}