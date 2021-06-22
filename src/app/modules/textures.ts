import * as Pixi from 'pixi.js';
import FontFaceObserver from 'fontfaceobserver';

import alphabet from '../../digital-rain/data-sources/alphabet';

type TextureSize = {
  width: number;
  height: number;
};

const baseTextureSize: TextureSize = {
  width: 256,
  height: 256,
};

const textureSize: TextureSize = {
  width: 32,
  height: 32,
};

type Textures = { [key: string]: Pixi.Texture };

const waitForFontToLoad = () => new FontFaceObserver('Noto Mono').load();

const generateTextures: () => Promise<Textures> = () => {
  return waitForFontToLoad().then(() => {
    const canvas = document.createElement('canvas');

    canvas.width = baseTextureSize.width;
    canvas.height = baseTextureSize.height;

    const context = canvas.getContext('2d');

    context.shadowColor = '#ffffff';
    context.shadowBlur = 4;
    context.font = '700 26px Noto Mono';
    context.fillStyle = '#ffffff';
    context.textBaseline = 'middle';
    context.textAlign = 'center';

    const baseTexture = Pixi.BaseTexture.from(canvas);

    return {
      ...Object.fromEntries(
        alphabet.split('').map((character, index) => {
          const row = Math.floor(index / (baseTextureSize.width / textureSize.width));
          const column = index % (baseTextureSize.width / textureSize.width);

          context.fillText(
            character,
            textureSize.width / 2 + column * textureSize.width,
            textureSize.height / 2 + row * textureSize.height,
            textureSize.width,
          );

          const texture = new Pixi.Texture(
            baseTexture,
            new Pixi.Rectangle(
              column * textureSize.width,
              row * textureSize.height,
              textureSize.width,
              textureSize.height,
            ),
          );

          return [character, texture];
        }),
      ),
      void: new Pixi.Texture(baseTexture, new Pixi.Rectangle(0, 0, 1, 1)),
    };
  });
};

export type { TextureSize, Textures };
export { textureSize, generateTextures };
