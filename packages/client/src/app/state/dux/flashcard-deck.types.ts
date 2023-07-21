import { ActionType } from "redux-util";
import { FullState } from "./index.types";
import { FlashcardData, FlashcardFilterData } from "app/utilities/types";

export interface FlashcardDeckState {
  activeCardId: FlashcardData["id"];
  activeFilter: FlashcardFilterData;
  deckSize: number;
  practiceHistory: FlashcardData["id"][];
  maxHitPercentage: number;
}

export interface CreateFlashcardDeckActionData {
  filter: FlashcardFilterData;
  cardCount: number;
}

export const types = {
  createFlashcardDeck: new ActionType<FullState, CreateFlashcardDeckActionData>(
    "flashcardDeck.create"
  ),
  loadMaxHitPercentage: new ActionType<FullState, number>(
    "flashcardDeck.maxHitPercentage.load"
  ),
  pickFlashcard: new ActionType<FullState, FlashcardData["id"]>(
    "flashcardDeck.flashcard.pick"
  ),
};
