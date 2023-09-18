import { ActionType, AsyncActionType } from "redux-util";
import { FullState } from "./index.types";
import { FlashcardData, FlashcardFilterData } from "practicard-shared";

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
  createFlashcardDeck: new AsyncActionType<
    FullState,
    null,
    CreateFlashcardDeckActionData,
    unknown
  >("flashcardDeck.create"),
  loadMaxHitPercentage: new AsyncActionType<FullState, null, number, unknown>(
    "flashcardDeck.maxHitPercentage.load"
  ),
  pickFlashcard: new AsyncActionType<
    FullState,
    null,
    FlashcardData["id"],
    unknown
  >("flashcardDeck.flashcard.pick"),
};
