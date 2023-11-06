import { useCallback, useEffect } from "react";
import { action, select, useSelector, useDispatch } from "..";
import {
  FlashcardData,
  FlashcardTagData,
  FlashcardCreationData,
  NewTagToFlashcardMap,
} from "practicard-shared";
import { FlashcardQuery } from "app/state/dux/flashcard.types";
import { BatchWithItemList } from "redux-util";

export const useFlashcardBatch = (
  query: FlashcardQuery
): BatchWithItemList<FlashcardData> | undefined => {
  const dispatch = useDispatch();

  const flashcardBatch = useSelector((state) =>
    select.getFlashcardBatchByQuery(state, query)
  );

  useEffect(() => {
    if (
      !flashcardBatch ||
      !(flashcardBatch.isValid || flashcardBatch.isLoading)
    ) {
      dispatch(action.loadFlashcardList(query));
    }
  }, [dispatch, flashcardBatch]);

  return flashcardBatch;
};

export const useCreateFlashcard = () => {
  const dispatch = useDispatch();

  return useCallback(
    (data?: Partial<Omit<FlashcardData, "id">>) => {
      dispatch(action.createFlashcardList(data && [data]));
    },
    [dispatch]
  );
};

export const useCreateFlashcardList = () => {
  const dispatch = useDispatch();

  return useCallback(
    (data: Partial<FlashcardCreationData>[]) => {
      dispatch(action.createFlashcardList(data));
    },
    [dispatch]
  );
};

export const useCreateFlashcardListWithNewTagMap = () => {
  const dispatch = useDispatch();

  return useCallback(
    (tagMap: NewTagToFlashcardMap, newCardList: FlashcardCreationData[]) => {
      dispatch(action.createFlashcardListWithNewTagMap(tagMap, newCardList));
    },
    [dispatch]
  );
};

export const useIsFlashcardRecentlyCreated = (id: FlashcardData["id"]) => {
  return useSelector((state) => select.isFlashcardRecentlyCreated(state, id));
};

export const useUpdateFlashcard = () => {
  const dispatch = useDispatch();

  return useCallback(
    (id: FlashcardData["id"], data: Partial<FlashcardData>) => {
      dispatch(action.updateFlashcard(id, data));
    },
    [dispatch]
  );
};

export const useDeleteFlashcardList = () => {
  const dispatch = useDispatch();

  return useCallback(
    (idList: FlashcardData["id"][]) => {
      dispatch(action.deleteFlashcardList(idList));
    },
    [dispatch]
  );
};

export const useAddTagToFlashcardList = () => {
  const dispatch = useDispatch();

  return useCallback(
    (tagId: FlashcardTagData["id"], flashcardIdList: FlashcardData["id"][]) => {
      dispatch(action.addTagToFlashcardList(tagId, flashcardIdList));
    },
    [dispatch]
  );
};

export const useRemoveTagFromFlashcardList = () => {
  const dispatch = useDispatch();

  return useCallback(
    (tagId: FlashcardTagData["id"], flashcardIdList: FlashcardData["id"][]) => {
      dispatch(action.removeTagFromFlashcardList(tagId, flashcardIdList));
    },
    [dispatch]
  );
};

export const useChangeTagListOnFlashcardList = () => {
  const dispatch = useDispatch();

  return useCallback(
    (
      addedTagIdList: FlashcardTagData["id"][],
      removedTagIdList: FlashcardTagData["id"][],
      flashcardIdList: FlashcardData["id"][]
    ) => {
      dispatch(
        action.changeTagListOnFlashcardList(
          addedTagIdList,
          removedTagIdList,
          flashcardIdList
        )
      );
    },
    [dispatch]
  );
};
