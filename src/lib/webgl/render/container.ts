import { RenderBase } from "./base";

export class Container extends RenderBase {
  private _children: Container[] = [];

  get children(): ReadonlyArray<Container> {
    return this._children;
  }

  addChildren(child: Container) {
    this._children.push(child);
  }

  removeChildren(child: Container) {
    const idx = this._children.indexOf(child);
    if (idx === -1) {
      return false;
    }

    this._children.splice(idx, 1);

    return true;
  }
}