import * as Pixi from 'pixi.js';

import Element from '../../digital-rain/classes/element';
import { Textures, textureSize } from './textures';

type Sprites = Pixi.Sprite[][];

const generateSprites: (props: { width: number; height: number }) => Sprites = (props) => {
  const { width, height } = props;

  return Array.from(Array(height).keys()).map((rowIndex) => {
    return Array.from(Array(width).keys()).map((columnIndex) => {
      const sprite = new Pixi.Sprite();

      sprite.x = Math.floor(textureSize.width / 2) + (textureSize.width + 4) * columnIndex;
      sprite.y = Math.floor(textureSize.height / 2) + textureSize.height * rowIndex;
      sprite.anchor.set(0.5);

      return sprite;
    });
  });
};

const generateSpriteProps: (props: {
  element: Element;
  textures: Textures;
}) => Partial<Pixi.Sprite> = (props) => {
  const { element, textures } = props;

  if (element.type === 'head') {
    return {
      texture: textures[element.content],
      alpha: 1,
      tint: 0xa7fab2,
    };
  }

  if (element.type === 'body') {
    return {
      texture: textures[element.content],
      alpha: 1,
      tint: 0x3faa57,
    };
  }

  if (element.type === 'tail') {
    return {
      texture: textures[element.content],
      alpha: element.opacity,
      tint: 0x3faa57,
    };
  }

  return {
    texture: null,
  };
};

export type { Sprites };
export { generateSprites, generateSpriteProps };
