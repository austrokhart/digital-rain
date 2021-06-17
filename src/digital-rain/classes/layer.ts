import seedRandom from 'seed-random';

import Stream from './stream';
import Element from './element';

class Layer {
  static streamTimeOffsetDistribution = (x: number) => x; /* linear */

  prng: () => number;

  size: {
    width: number;
    height: number;
  };

  waves: {
    number: number;
  };

  streams: {
    timeOffset: number;
    position: number;
    instance: Stream;
  }[];

  constructor(props: { seed: string; width: number; height: number }) {
    const { seed, width, height } = props;

    this.prng = seedRandom(seed);

    this.size = {
      width,
      height,
    };

    this.waves = {
      number: 0,
    };

    this.streams = [];
  }

  hasLackOfStreams() {
    const minNumberOfStreams = this.size.width * 6;

    return this.streams.length < minNumberOfStreams;
  }

  generateWaveOfStreams() {
    const commonTimeOffset = Math.floor(0.5 * this.size.height * this.waves.number);

    this.streams = [
      ...this.streams,
      ...Array.from(Array(this.size.width).keys()).map((index) => {
        const timeOffset = Math.abs(
          commonTimeOffset +
            Math.floor(
              (-0.5 + Layer.streamTimeOffsetDistribution(this.prng())) * 0.6 * this.size.height,
            ),
        );

        const position = index;

        const seed = String(this.prng());
        const size = this.size.height;

        const instance = new Stream({ seed, size });

        return {
          timeOffset,
          position,
          instance,
        };
      }),
    ];

    this.waves.number += 1;
  }

  hasUsedStreams(props: { time: number }) {
    const { time } = props;

    return this.streams.some((stream) => {
      const lifetimeEnd = stream.instance.size + stream.instance.visibleSize.full;

      return -stream.timeOffset + time > lifetimeEnd;
    });
  }

  cleanUsedStreams(props: { time: number }) {
    const { time } = props;

    this.streams = this.streams.filter((stream) => {
      const lifetimeEnd = stream.instance.size + stream.instance.visibleSize.full;

      return -stream.timeOffset + time <= lifetimeEnd;
    });
  }

  render(props: { time: number }): Element[][] {
    const { time } = props;

    const emptyLayer = Array.from(Array(this.size.height)).map(() => {
      return Array.from(Array(this.size.width)).map(() => new Element({ type: 'void' }));
    });

    return this.streams
      .filter((stream) => {
        const lifetimeStart = 0;
        const lifetimeEnd = stream.instance.size + stream.instance.visibleSize.full;

        return (
          lifetimeStart < -stream.timeOffset + time && -stream.timeOffset + time <= lifetimeEnd
        );
      })
      .reduce((layer, stream) => {
        const { timeOffset, position, instance } = stream;

        instance.render({ time: -timeOffset + time }).forEach((element, index) => {
          if (element.type !== 'void') {
            const row = index;
            const column = position;

            // eslint-disable-next-line no-param-reassign
            layer[row][column] = element;
          }
        });

        return layer;
      }, emptyLayer);
  }
}

export default Layer;
