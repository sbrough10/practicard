import { ActionType } from "redux-util";
import { FullState } from "./index.types";
import { FlashcardTagData } from "../../utilities/types";

export type FlashcardTagMap = {
  [id: FlashcardTagData["id"]]: FlashcardTagData;
};

export interface FlashcardTagState {
  map: FlashcardTagMap | undefined;
  isLoading: boolean;
}

export const types = {
  loadFlashcardTagMap: new ActionType<FullState, FlashcardTagMap>(
    "flashcardTag.load"
  ),
  createFlashcardTag: new ActionType<FullState, FlashcardTagData>(
    "flashcardTag.create"
  ),
  updateFlashcardTag: new ActionType<FullState, FlashcardTagData>(
    "flashcardTag.update"
  ),
};
