import { useCallback, useEffect } from "react";
import { action, select, useDispatch, useSelector } from "..";

export const useFlashcardTagMap = () => {
  const dispatch = useDispatch();

  const tagMap = useSelector(select.getFlashcardTagMap);
  const isLoading = useSelector(select.isFlashcardTagMapLoading);

  useEffect(() => {
    // TODO - Every instance of this hook is dispatching the action because the state is not updated
    // until all of these `useEffect` callbacks are executed. There has to be a way to suspend the
    // callbacks until the state is updated.
    if (!isLoading && !tagMap) {
      dispatch(action.queueLoadFlashcardTagMap());
    }
  }, [dispatch, tagMap, isLoading]);

  return tagMap;
};

export const useCreateFlashcardTag = () => {
  const dispatch = useDispatch();

  return useCallback(
    (label: string) => {
      dispatch(action.createFlashcardTag(label));
    },
    [dispatch]
  );
};
