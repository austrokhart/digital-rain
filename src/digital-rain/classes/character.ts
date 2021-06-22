import bezierEasing from 'bezier-easing';

import alphabet from '../data-sources/alphabet';

/*
 * use an outer generator for better performance
 */
class Character {
  static mutationRateLimit = 1 / 4;

  static mutationModifierDistribution = bezierEasing(0.55, 0, 1, 0.45); /* easeInCirc */

  generator: () => number;

  initialPosition: number;

  mutationModifier: number;

  mutationPositionOffset: number;

  constructor(props: { generator: () => number }) {
    const { generator } = props;

    this.generator = generator;

    this.generateInitialIndex();
    this.generateMutationModifier();
    this.generateMutationPositionOffset();
  }

  generateInitialIndex() {
    this.initialPosition = Math.floor(alphabet.length * this.generator());
  }

  generateMutationModifier() {
    this.mutationModifier = Character.mutationModifierDistribution(this.generator());
  }

  generateMutationPositionOffset() {
    this.mutationPositionOffset = Math.floor(alphabet.length * this.generator());
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
