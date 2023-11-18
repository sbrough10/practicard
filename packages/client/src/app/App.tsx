import React, { useCallback, useEffect, useState } from "react";
import { FlashcardDeckBuilderView } from "./views/FlashcardDeckBuilderView";
import {
  FlashcardFilterData,
  defaultFlashcardFilterData,
} from "practicard-shared";
import { FlashcardPracticeView } from "app/views/FlashcardPracticeView";
import { useHasSession, useIsLoadingSession } from "app/state";
import { WorkspaceSelectorView } from "./views/WorkspaceSelectorView";
import { LoadingIndicatorOverlay } from "./components/LoadingIndicatorOverlay";

export const App: React.FC = () => {
  const [isPracticing, setIsPracticing] = useState(false);
  const [filter, setFilter] = useState(defaultFlashcardFilterData);

  const hasSession = useHasSession();
  const isLoadingSession = useIsLoadingSession();

  useEffect(() => {
    if (!hasSession) {
      setFilter(defaultFlashcardFilterData);
    }
  }, [hasSession]);

  const onStartPractice = useCallback(() => {
    setIsPracticing(true);
  }, []);

  const onExitPractice = useCallback(() => {
    setIsPracticing(false);
  }, []);

  const onChangeFilter = useCallback((filter: FlashcardFilterData) => {
    setFilter(filter);
  }, []);

  if (!hasSession) {
    return (
      <>
        <WorkspaceSelectorView />
        {isLoadingSession && <LoadingIndicatorOverlay />}
      </>
    );
  }

  if (isPracticing) {
    return <FlashcardPracticeView onExit={onExitPractice} />;
  }

  return (
    <FlashcardDeckBuilderView
      filter={filter}
      onChangeFilter={onChangeFilter}
      onStartPractice={onStartPractice}
    />
  );
};
