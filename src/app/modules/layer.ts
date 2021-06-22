import Layer from '../../digital-rain/classes/layer';

import { spriteSize } from './sprites';

const generateLayer: (props: { seed: string }) => Layer = (props) => {
  const { seed } = props;

  const width = Math.ceil(window.innerWidth / spriteSize.width);
  const height = Math.ceil(window.innerHeight / (spriteSize.height - 4));

  return new Layer({ seed, width, height });
};

// eslint-disable-next-line import/prefer-default-export
export { generateLayer };
