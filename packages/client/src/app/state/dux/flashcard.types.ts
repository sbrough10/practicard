import {
  CreateFlashcardListAndTagList,
  FlashcardData,
  FlashcardFilterData,
  FlashcardTagData,
} from "practicard-shared";
import { ActionType, AsyncActionType } from "redux-util";
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
  loadFlashcard: new AsyncActionType<
    FullState,
    FlashcardData["id"],
    FlashcardData,
    FlashcardData["id"]
  >("flashcard.load"),
  loadFlashcardList: new AsyncActionType<
    FullState,
    FlashcardQuery,
    LoadFlashcardListActionData,
    FlashcardQuery
  >("flashcard.bulkLoad"),
  createFlashcardListFromNewTagMap: new AsyncActionType<
    FullState,
    null,
    FlashcardTagData[],
    unknown
  >("flashcard.bulkCreateWithBulkTagCreate"),
  createFlashcardList: new AsyncActionType<
    FullState,
    null,
    FlashcardData[],
    unknown
  >("flashcard.bulkCreate"),
  removeFlashcardListFromRecentlyCreated: new ActionType<
    FullState,
    FlashcardData["id"][]
  >("flashcard.recentlyCreated.remove"),
  updateFlashcard: new AsyncActionType<
    FullState,
    null,
    UpdateFlashcardActionData,
    unknown
  >("flashcard.update"),
  markFlashcardListForDeletion: new AsyncActionType<
    FullState,
    null,
    FlashcardData["id"][],
    unknown
  >("flashcard.bulkDelete.mark"),
  finalizeFlashcardListDeletion: new ActionType<FullState, void>(
    "flashcard.bulkDelete.finalize"
  ),
  addTagToFlashcardList: new AsyncActionType<
    FullState,
    null,
    ChangeTagForFlashcardListActionData,
    unknown
  >("flashcard.tag.bulkAdd"),
  removeTagFromFlashcardList: new AsyncActionType<
    FullState,
    null,
    ChangeTagForFlashcardListActionData,
    unknown
  >("flashcard.tag.bulkRemove"),
};
