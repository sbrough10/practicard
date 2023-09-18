import { useCallback, useEffect } from "react";
import { action, select, useDispatch, useSelector } from "..";
import { SessionCreationParams } from "practicard-shared";

export const useStartSession = () => {
  const dispatch = useDispatch();

  return useCallback(
    (params: SessionCreationParams) => {
      dispatch(action.startSession(params));
    },
    [dispatch]
  );
};

export const useStartLocalSession = () => {
  const dispatch = useDispatch();

  return useCallback(() => {
    dispatch(action.startLocalSession());
  }, [dispatch]);
};

export const useHasSession = () => {
  const dispatch = useDispatch();

  const hasSession = useSelector(select.hasSession);
  const isLoading = useSelector(select.isLoadingSession);

  useEffect(() => {
    if (hasSession === undefined && !isLoading) {
      dispatch(action.loadSession());
    }
  }, [hasSession, isLoading]);

  return hasSession;
};

export const useHasLocalSession = () => {
  const hasSession = useSelector(select.hasSession);
  const isLocal = useSelector(select.isLocalSession);

  return hasSession && isLocal;
};

export const useEndSession = () => {
  const dispatch = useDispatch();

  return useCallback(() => {
    dispatch(action.endSession());
  }, [dispatch]);
};
