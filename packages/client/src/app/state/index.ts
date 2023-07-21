import { getUseSelector, createStore, getUseDispatch } from "redux-util";
import { FullState } from "./dux/index.types";

import * as flashcard from "./dux/flashcard";
import * as flashcardTag from "./dux/flashcard-tag";
import * as flashcardDeck from "./dux/flashcard-deck";

export const useSelector = getUseSelector<FullState>();

export const useDispatch = getUseDispatch<FullState>();

export const action = {
  ...flashcard.action,
  ...flashcardTag.action,
  ...flashcardDeck.action,
};

export const select = {
  ...flashcard.select,
  ...flashcardTag.select,
  ...flashcardDeck.select,
};

const reducer = {
  flashcard: flashcard.reducer,
  flashcardTag: flashcardTag.reducer,
  flashcardDeck: flashcardDeck.reducer,
};

export const store = createStore<FullState>(reducer);

export * from "./hooks";
