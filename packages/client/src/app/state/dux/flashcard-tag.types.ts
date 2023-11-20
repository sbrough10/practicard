import { ActionType, AsyncActionType } from "redux-util";
import { FullState } from "./index.types";
import { FlashcardTagData } from "practicard-shared";

export type FlashcardTagMap = {
  [id: FlashcardTagData["id"]]: FlashcardTagData;
};

export interface FlashcardTagState {
  map: FlashcardTagMap | undefined;
  isLoading: boolean;
}

export const types = {
  queueLoadFlashcardTagMap: new ActionType<FullState, void>(
    "flashcardTag.queueLoad"
  ),
  loadFlashcardTagMap: new AsyncActionType<
    FullState,
    null,
    FlashcardTagMap,
    unknown
  >("flashcardTag.load"),
  createFlashcardTag: new AsyncActionType<
    FullState,
    null,
    FlashcardTagData,
    unknown
  >("flashcardTag.create"),
  updateFlashcardTag: new AsyncActionType<
    FullState,
    null,
    FlashcardTagData,
    void
  >("flashcardTag.update"),
};
