export type ArrayLike = {
  length: number;
  [index: number]: number;
}

export interface IWriteableStructure {
  writeSelf(target: ArrayLike, offset?: number): void;
  get length(): number;
}