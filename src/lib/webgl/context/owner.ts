import { IWebglOwner } from "../types";

type WebglContextOwnerProps = {
  gl: WebGL2RenderingContext;
}

export class WebglContextOwner implements IWebglOwner {
  private _props: WebglContextOwnerProps;
  constructor(props: WebglContextOwnerProps) {
    this._props = props;
  }

  get gl(): WebGL2RenderingContext {
    return this._props.gl;
  }
}