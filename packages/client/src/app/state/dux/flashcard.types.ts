import {
  FlashcardData,
  FlashcardFilterData,
  FlashcardTagData,
} from "../../utilities/types";
import { ActionType } from "redux-util";
import { FullState } from "./index.types";
import { WithBatchMap } from "redux-util/lib/types";

export interface FlashcardQuery {
  filter?: FlashcardFilterData;
}

export interface FlashcardState
  extends WithBatchMap<FlashcardData, FlashcardQuery> {
  recentlyCreated: FlashcardData["id"][];
  markedForDeletion: FlashcardData["id"][];
}

export interface LoadFlashcardListActionData {
  list: FlashcardData[];
  query: FlashcardQuery;
}

export interface UpdateFlashcardActionData {
  id: FlashcardData["id"];
  data: Partial<FlashcardData>;
}

export interface ChangeTagForFlashcardListActionData {
  tagId: FlashcardTagData["id"];
  flashcardIdList: FlashcardData["id"][];
}

export const types = {
  loadFlashcard: new ActionType<FullState, FlashcardData>("flashcard.load"),
  loadFlashcardList: new ActionType<FullState, LoadFlashcardListActionData>(
    "flashcard.bulkLoad"
  ),
  createFlashcardList: new ActionType<FullState, FlashcardData[]>(
    "flashcard.bulkCreate"
  ),
  removeFlashcardListFromRecentlyCreated: new ActionType<
    FullState,
    FlashcardData["id"][]
  >("flashcard.recentlyCreated.remove"),
  updateFlashcard: new ActionType<FullState, UpdateFlashcardActionData>(
    "flashcard.update"
  ),
  markFlashcardListForDeletion: new ActionType<
    FullState,
    FlashcardData["id"][]
  >("flashcard.bulkDelete.mark"),
  finalizeFlashcardListDeletion: new ActionType<FullState, void>(
    "flashcard.bulkDelete.finalize"
  ),
  addTagToFlashcardList: new ActionType<
    FullState,
    ChangeTagForFlashcardListActionData
  >("flashcard.tag.bulkAdd"),
  removeTagFromFlashcardList: new ActionType<
    FullState,
    ChangeTagForFlashcardListActionData
  >("flashcard.tag.bulkRemove"),
};
