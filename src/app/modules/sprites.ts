import * as Pixi from 'pixi.js';

import Element from '../../digital-rain/classes/element';
import { Textures } from './textures';

const spriteSize = {
  width: 24,
  height: 24,
};

type Sprites = Pixi.Sprite[][];

const generateSprites: (props: { width: number; height: number; textures: Textures }) => Sprites = (
  props,
) => {
  const { width, height, textures } = props;

  return Array.from(Array(height).keys()).map((rowIndex) => {
    return Array.from(Array(width).keys()).map((columnIndex) => {
      const sprite = new Pixi.Sprite(textures.void);

      sprite.width = spriteSize.width;
      sprite.height = spriteSize.height;
      sprite.x = spriteSize.width * columnIndex;
      sprite.y = (spriteSize.height - 4) * rowIndex;

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
    texture: textures.void,
  };
};

export type { Sprites };
export { spriteSize, generateSprites, generateSpriteProps };
