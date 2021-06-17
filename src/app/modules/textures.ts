import * as Pixi from 'pixi.js';
import FontFaceObserver from 'fontfaceobserver';

import alphabet from '../../digital-rain/data-sources/alphabet';

type TextureSize = {
  width: number;
  height: number;
};

const textureSize: TextureSize = {
  width: 20,
  height: 20,
};

type Textures = { [key: string]: Pixi.Texture };

const waitForFontToLoad = () => new FontFaceObserver('Noto Mono').load();

const generateTextures: () => Promise<Textures> = () => {
  return waitForFontToLoad().then(() => {
    return Object.fromEntries(
      alphabet.split('').map((character) => {
        const style = new Pixi.TextStyle({
          fontFamily: 'Noto Mono',
          fontSize: textureSize.height,
          fontWeight: '700',
          dropShadow: true,
          dropShadowDistance: 0,
          dropShadowColor: '#ffffff',
          dropShadowBlur: 4,
          dropShadowAlpha: 1,
          fill: '#ffffff',
        });

        const element = new Pixi.Text(character, style);

        element.updateText(true);

        return [character, element.texture];
      }),
    );
  });
};

export type { TextureSize, Textures };
export { textureSize, generateTextures };
