import { FlashcardState } from "./flashcard.types";
import { FlashcardTagState } from "./flashcard-tag.types";
import { FlashcardDeckState } from "./flashcard-deck.types";

export interface FullState {
  flashcard: FlashcardState;
  flashcardTag: FlashcardTagState;
  flashcardDeck: FlashcardDeckState;
}
