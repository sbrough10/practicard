import { createSliceReducer } from "redux-util";
import {
  FlashcardData,
  FlashcardFilterData,
  defaultFlashcardFilterData,
} from "app/utilities/types";
import { FullState } from "./index.types";
import {
  loadStorageItem,
  storeStorageItem,
} from "../../utilities/local-storage";
import { FlashcardDeckState, types } from "./flashcard-deck.types";
import { fetchCardMap, getFlashcardListFromStorage } from "./flashcard";
import { getHitPercentage, randomInteger } from "../../utilities/common";

const InitialState: FlashcardDeckState = {
  activeCardId: -1,
  activeFilter: defaultFlashcardFilterData,
  deckSize: 0,
  maxHitPercentage: 0,
  practiceHistory: [],
};

const STORAGE_KEY = "flashcardDeckV1";

interface StorageFormatV1 {
  flashcardIdList: FlashcardData["id"][];
}

const fetchDeck = (): StorageFormatV1 =>
  loadStorageItem(STORAGE_KEY) ?? { flashcardIdList: [] };

const MAX_PICK_RETRY = 25;

const pickFlashcard = (
  list: FlashcardData[],
  state: FlashcardDeckState
): FlashcardData | null => {
  if (list.length === 0) {
    return null;
  }
  const maxHitPercentage = Math.random() * state.maxHitPercentage;
  console.log(`Max hit %: ${maxHitPercentage * 100}%`);
  let bestPick: { card: FlashcardData; hitPercentage: number } | undefined;
  const skipCards = state.practiceHistory.slice(
    0,
    Math.min(
      state.practiceHistory.length,
      Math.floor(Math.sqrt(list.length) - 1)
    )
  );
  for (let attempt = 0; attempt < list.length; attempt++) {
    const index = randomInteger(0, list.length - 1);
    const flashcard = list[index];
    const hitPercentage = getHitPercentage(flashcard);
    if (
      skipCards.indexOf(flashcard.id) === -1 &&
      (!bestPick || bestPick.hitPercentage < hitPercentage)
    ) {
      bestPick = { card: flashcard, hitPercentage };
    }
    if (
      skipCards.indexOf(flashcard.id) === -1 &&
      maxHitPercentage >= hitPercentage
    ) {
      console.log(`Picked card on attempt ${attempt}`);
      return flashcard;
    }
  }
  if (!bestPick) {
    console.log("Every random card was the card to skip");
    return list[randomInteger(0, list.length - 1)];
  }
  console.log(
    `Max attempts reached. Best pick ${bestPick.hitPercentage * 100}% hit`
  );
  return bestPick.card;
};

export const action = {
  createFlashcardDeck: (filter: FlashcardFilterData) =>
    types.createFlashcardDeck.createAction(() => {
      const list = getFlashcardListFromStorage(filter);
      storeStorageItem(STORAGE_KEY, {
        flashcardIdList: list.map((card) => card.id),
      });
      return { filter, cardCount: list.length };
    }),

  loadMaxHitPercentage: (deckId: 0) =>
    types.loadMaxHitPercentage.createAction(() => {
      const { map: cardMap } = fetchCardMap();
      const { flashcardIdList } = fetchDeck();
      return flashcardIdList.reduce((maxHitPercentage, id) => {
        const currentHitPercentage = getHitPercentage(cardMap[id]);
        return currentHitPercentage > maxHitPercentage
          ? currentHitPercentage
          : maxHitPercentage;
      }, 0);
    }),

  // TODO - Add the concept of multiple decks
  pickFlashcard: (deckId: 0) =>
    types.pickFlashcard.createAction((dispatch, getState) => {
      const { flashcardIdList } = fetchDeck();
      const { map } = fetchCardMap();

      // TODO - We definitely should not be fetching the data this way in this part of the code
      dispatch(
        action.createFlashcardDeck(getState().flashcardDeck.activeFilter)
      );
      dispatch(action.loadMaxHitPercentage(0));

      const flashcard = pickFlashcard(
        flashcardIdList.map((id) => map[id]),
        getState().flashcardDeck
      );
      return flashcard?.id || -1;
    }),
};

export const select = {
  getActiveFlashcardId: (state: FullState): FlashcardData["id"] => {
    return state.flashcardDeck.activeCardId;
  },

  getActiveDeckCardCount: (state: FullState): number => {
    return state.flashcardDeck.deckSize;
  },
};

export const reducer = createSliceReducer(InitialState, [
  types.createFlashcardDeck.createReducer((state, { filter, cardCount }) => {
    return { ...state, activeFilter: filter, deckSize: cardCount };
  }),
  types.loadMaxHitPercentage.createReducer((state, maxHitPercentage) => {
    return { ...state, maxHitPercentage };
  }),

  types.pickFlashcard.createReducer((state, id) => {
    return {
      ...state,
      activeCardId: id,
      practiceHistory: [id, ...state.practiceHistory],
    };
  }),
]);
