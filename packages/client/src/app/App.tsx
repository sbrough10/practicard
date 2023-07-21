import React, { useCallback, useState } from "react";
import { Provider } from "react-redux";
import { store } from "./state";
import { FlaschardDeckBuilderView } from "./views/FlaschardDeckBuilderView";
import {
  FlashcardFilterData,
  defaultFlashcardFilterData,
} from "./utilities/types";
import { FlaschardPracticeView } from "./views/FlashcardPracticeView";

export const App: React.FC = () => {
  const [isPracticing, setIsPracticing] = useState(false);
  const [filter, setFilter] = useState(defaultFlashcardFilterData);

  const onStartPractice = useCallback(() => {
    setIsPracticing(true);
  }, []);

  const onExitPractice = useCallback(() => {
    setIsPracticing(false);
  }, []);

  const onChangeFilter = useCallback((filter: FlashcardFilterData) => {
    setFilter(filter);
  }, []);

  return (
    <Provider store={store}>
      {isPracticing ? (
        <FlaschardPracticeView onExit={onExitPractice} />
      ) : (
        <FlaschardDeckBuilderView
          filter={filter}
          onChangeFilter={onChangeFilter}
          onStartPractice={onStartPractice}
        />
      )}
    </Provider>
  );
};
