import { IRenderable2D, IRenderContext } from "../types";
import { Transform2D } from "./transform";

export class Container implements IRenderable2D {
  private _children: IRenderable2D[] = [];

  transform = new Transform2D();

  get children(): ReadonlyArray<IRenderable2D> {
    return this._children;
  }

  addChildren(child: IRenderable2D) {
    this._children.push(child);
  }

  removeChildren(child: IRenderable2D) {
    const idx = this._children.indexOf(child);
    if (idx === -1) {
      return false;
    }

    this._children.splice(idx, 1);

    return true;
  }

  render(ctx: IRenderContext): void {
    for (const children of this._children) {
      children.transform.applyParent(this.transform);
      children.render(ctx);
    }
  }
}