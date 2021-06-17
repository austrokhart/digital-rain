import Layer from '../../digital-rain/classes/layer';

import { textureSize } from './textures';

const generateLayer: (props: { seed: string }) => Layer = (props) => {
  const { seed } = props;

  const width = Math.ceil(window.innerWidth / (textureSize.width + 4));
  const height = Math.ceil(window.innerHeight / textureSize.height);

  return new Layer({ seed, width, height });
};

// eslint-disable-next-line import/prefer-default-export
export { generateLayer };
