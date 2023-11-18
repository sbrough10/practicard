import { ActionType, AsyncActionType } from "redux-util";
import { FullState } from "./index.types";
import { FlashcardData, FlashcardFilterData } from "practicard-shared";

export interface FlashcardDeckState {
  activeCardId: FlashcardData["id"];
  activeFilter: FlashcardFilterData;
  deckSize: number;
  practiceHistory: FlashcardData["id"][];
  maxHitPercentage: number;
  minHitPercentage: number;
  isPickingNextCard: boolean;
}

export interface CreateFlashcardDeckActionData {
  filter: FlashcardFilterData;
  cardCount: number;
}

export interface LoadHitPercentageRangeActionData {
  min: number;
  max: number;
}

export const types = {
  createFlashcardDeck: new AsyncActionType<
    FullState,
    null,
    CreateFlashcardDeckActionData,
    unknown
  >("flashcardDeck.create"),
  loadHitPercentageRange: new AsyncActionType<
    FullState,
    null,
    LoadHitPercentageRangeActionData,
    unknown
  >("flashcardDeck.maxHitPercentage.load"),
  pickFlashcard: new AsyncActionType<
    FullState,
    null,
    FlashcardData["id"],
    unknown
  >("flashcardDeck.flashcard.pick"),
};
