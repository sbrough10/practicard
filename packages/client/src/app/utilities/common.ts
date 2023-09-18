import { FlashcardData, getHitPercentage } from "practicard-shared";

export const randomInteger = (min: number, max: number): number => {
  const value = Math.floor(Math.random() * (1 + max - min) - min);
  // In the unlikely case that `Math.random()` return `1`,
  // the value will be above the desired floor,
  // in which case another nubmer is generated
  if (value === max + 1) {
    return randomInteger(min, max);
  }
  return value;
};

export const displayHitPercentage = (flashcard: FlashcardData) => {
  return `${(getHitPercentage(flashcard) * 100).toFixed(0)}%`;
};
