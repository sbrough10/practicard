import { useCallback, useEffect } from "react";
import { action, select, useDispatch, useSelector } from "..";
import { FlashcardFilterData } from "practicard-shared";
import { isEqual } from "lodash";

// TODO - Allow multiple decks
export const useActiveFlashcard = (deckId: 0) => {
  const dispatch = useDispatch();

  const flashcardId = useSelector(select.getActiveFlashcardId);
  const flashcard = useSelector((state) =>
    select.getFlashcardById(state, flashcardId)
  );

  useEffect(() => {
    if (flashcardId > -1 && !flashcard) {
      dispatch(action.loadFlashcard(flashcardId));
    }
  });

  return flashcard;
};

export const useCreateFlashcardDeck = () => {
  const dispatch = useDispatch();

  return useCallback(
    (filter: FlashcardFilterData) => {
      dispatch(action.createFlashcardDeck(filter));
    },
    [dispatch]
  );
};

export const usePickNewFlashcard = () => {
  const dispatch = useDispatch();

  return useCallback(
    (deckId: 0) => {
      dispatch(action.pickFlashcard(deckId));
    },
    [dispatch]
  );
};

export const useActiveDeckCardCount = () => {
  return useSelector(select.getActiveDeckCardCount);
};

export const useIsPickingNextFlashcard = () => {
  return useSelector(select.getIsPickingNextFlashcard);
};
