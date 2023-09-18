import { getUseSelector, createStore, getUseDispatch } from "redux-util";
import { FullState } from "./dux/index.types";

import * as flashcard from "./dux/flashcard";
import * as flashcardTag from "./dux/flashcard-tag";
import * as flashcardDeck from "./dux/flashcard-deck";
import * as session from "./dux/session";
import * as user from "./dux/user";
import * as workspace from "./dux/workspace";

export const action = {
  ...flashcard.action,
  ...flashcardTag.action,
  ...flashcardDeck.action,
  ...session.action,
  ...user.action,
  ...workspace.action,
};

export const select = {
  ...flashcard.select,
  ...flashcardTag.select,
  ...flashcardDeck.select,
  ...session.select,
  ...user.select,
  ...workspace.select,
};

const reducer = {
  flashcard: flashcard.reducer,
  flashcardTag: flashcardTag.reducer,
  flashcardDeck: flashcardDeck.reducer,
  session: session.reducer,
  user: user.reducer,
  workspace: workspace.reducer,
};

export const store = createStore<FullState>(reducer);

export const useSelector = getUseSelector<FullState>();

export const useDispatch = getUseDispatch<FullState>();

export * from "./hooks";
