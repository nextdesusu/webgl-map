export type TexturePropsInner = {
  mipmap: number;
  format: number;
  sourceFormat: number;
  sourceType: number;

  wrapS: number;
  wrapT: number;
  minFilter: number;
  maxFilter: number;
}

export type TextureProps = Partial<TexturePropsInner>;