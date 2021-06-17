import * as Pixi from 'pixi.js';
import memoizeOne from 'memoize-one';

import 'reset-css';
import '@fontsource/noto-mono/index.css';

import { Textures, generateTextures } from './modules/textures';
import { generateSprites, generateSpriteProps } from './modules/sprites';
import { generateLayer } from './modules/layer';

import './styles.css';

const frameRateLimit = 1 / 6;

const createApp: (props: { seed: string; textures: Textures }) => {
  app: Pixi.Application;
  toggleTicker: () => void;
} = (props) => {
  const { seed, textures } = props;

  const layer = generateLayer({ seed });

  const app = new Pixi.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundAlpha: 0,
    resolution: devicePixelRatio,
    autoDensity: true,
  });

  const sprites = generateSprites({
    width: layer.size.width,
    height: layer.size.height,
  });

  sprites.forEach((row) => {
    row.forEach((sprite) => {
      app.stage.addChild(sprite);
    });
  });

  const memoizedRender = memoizeOne((time: number) => layer.render({ time }));

  let frame = 0;
  let previousRender = memoizedRender(0);

  const handleTick: (delta: number) => void = (delta) => {
    frame += 1 + delta;

    const time = Math.floor(frame * frameRateLimit);

    if (layer.hasUsedStreams({ time })) {
      layer.cleanUsedStreams({ time });
    }

    while (layer.hasLackOfStreams()) {
      layer.generateWaveOfStreams();
    }

    const render = memoizedRender(time);

    if (render !== previousRender) {
      render.forEach((row, rowIndex) => {
        row.forEach((element, columnIndex) => {
          const sprite = sprites[rowIndex][columnIndex];

          Object.assign(sprite, generateSpriteProps({ element, textures }));
        });
      });

      previousRender = render;
    }
  };

  app.ticker.add(handleTick);

  const toggleTicker = () => {
    if (app.ticker.started) {
      app.ticker.stop();
    } else {
      app.ticker.start();
    }
  };

  return { app, toggleTicker };
};

generateTextures().then((textures) => {
  const seed = String(Math.random());
  const container = document.querySelector('#app');

  let { app, toggleTicker } = createApp({ seed, textures });
  container.appendChild(app.view);

  const handleResize = () => {
    app.destroy(true);

    ({ app, toggleTicker } = createApp({ seed, textures }));
    container.appendChild(app.view);
  };

  const handleClick = () => {
    toggleTicker();
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.code === 'Space') {
      toggleTicker();
    }
  };

  window.addEventListener('resize', handleResize);

  document.addEventListener('click', handleClick);
  document.addEventListener('touchstart', handleClick);

  document.addEventListener('keydown', handleKeydown);
});
