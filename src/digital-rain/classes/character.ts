import seedRandom from 'seed-random';
import bezierEasing from 'bezier-easing';

import alphabet from '../data-sources/alphabet';

class Character {
  static mutationRateLimit = 1 / 4;

  static mutationModifierDistribution = bezierEasing(0.55, 0, 1, 0.45); /* easeInCirc */

  prng: () => number;

  initialPosition: number;

  mutationModifier: number;

  mutationPositionOffset: number;

  constructor(props: { seed: string }) {
    const { seed } = props;

    this.prng = seedRandom(seed);

    this.generateInitialIndex();
    this.generateMutationModifier();
    this.generateMutationPositionOffset();
  }

  generateInitialIndex() {
    this.initialPosition = Math.floor(alphabet.length * this.prng());
  }

  generateMutationModifier() {
    this.mutationModifier = Character.mutationModifierDistribution(this.prng());
  }

  generateMutationPositionOffset() {
    this.mutationPositionOffset = Math.floor(alphabet.length * this.prng());
  }

  render(props: { time: number }): string {
    const { time } = props;

    const position =
      this.initialPosition +
      Math.floor(this.mutationModifier * time * Character.mutationRateLimit) *
        this.mutationPositionOffset;

    return alphabet[position % alphabet.length];
  }
}

export default Character;
