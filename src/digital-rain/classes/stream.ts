import seedRandom from 'seed-random';
import bezierEasing from 'bezier-easing';

import Character from './character';
import Element from './element';

class Stream {
  static visibleFullSizeDistribution = bezierEasing(0.12, 0, 0.39, 0); /* easeInSine */

  static visibleBodySizeDistribution = bezierEasing(0.12, 0, 0.39, 0); /* easeInSine */

  static tailOpacityDistribution = bezierEasing(0.61, 1, 0.88, 1); /* easeOutSine */

  prng: () => number;

  size: number;

  visibleSize: {
    full: number;
    body: number;
  };

  characters: {
    timeOffset: number;
    instance: Character;
  }[];

  constructor(props: { seed: string; size: number }) {
    const { seed, size } = props;

    this.prng = seedRandom(seed);
    this.size = size;

    this.generateVisibleSize();
    this.generateCharacters();
  }

  generateVisibleSize() {
    const full = Math.floor(
      Math.max(8, Stream.visibleFullSizeDistribution(this.prng()) * this.size),
    );

    const body = Math.floor(
      Math.max(4, Stream.visibleBodySizeDistribution(this.prng()) * 0.75 * full),
    );

    this.visibleSize = {
      full,
      body,
    };
  }

  generateCharacters() {
    const characters = Array.from(Array(this.size).keys()).map((i) => {
      const timeOffset = i;

      const seed = String(this.prng());
      const instance = new Character({ seed });

      return {
        timeOffset,
        instance,
      };
    });

    this.characters = characters;
  }

  render(props: { time: number }): Element[] {
    const { time } = props;

    const headPosition = time;
    const headStart = headPosition - 1;
    const bodyStart = headPosition - this.visibleSize.body;
    const tailStart = headPosition - this.visibleSize.full;

    const tailLength = this.visibleSize.full - this.visibleSize.body;

    return [
      ...this.characters.slice(0, Math.max(0, tailStart)).map(() => {
        const type = 'void';

        return new Element({ type });
      }),

      ...this.characters
        .slice(Math.max(0, tailStart), Math.max(0, bodyStart))
        .map((character, index) => {
          const { timeOffset, instance } = character;

          const positionRelativeToTail = Math.max(-tailStart, 0) + index;

          const type = 'tail';
          const content = instance.render({ time: -timeOffset + time });
          const opacity = Stream.tailOpacityDistribution(positionRelativeToTail / tailLength);

          return new Element({
            type,
            content,
            opacity,
          });
        }),

      ...this.characters.slice(Math.max(0, bodyStart), Math.max(0, headStart)).map((character) => {
        const { timeOffset, instance } = character;

        const type = 'body';
        const content = instance.render({ time: -timeOffset + time });

        return new Element({ type, content });
      }),

      ...this.characters
        .slice(Math.max(0, headStart), Math.max(0, headPosition))
        .map((character) => {
          const { timeOffset, instance } = character;

          const type = 'head';
          const content = instance.render({ time: -timeOffset + time });

          return new Element({ type, content });
        }),

      ...this.characters.slice(Math.max(0, headPosition)).map(() => {
        const type = 'void';

        return new Element({ type });
      }),
    ].slice(0, this.size);
  }
}

export default Stream;
