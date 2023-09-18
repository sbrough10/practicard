import { GetRequest, createSliceReducer } from "redux-util";
import {
  ApiPath,
  FlashcardData,
  FlashcardFilterData,
  defaultFlashcardFilterData,
  getHitPercentage,
} from "practicard-shared";
import { FullState } from "./index.types";
import { loadStorageItem, storeStorageItem } from "app/utilities/local-storage";
import { FlashcardDeckState, types } from "./flashcard-deck.types";
import { fetchCardMap, getFlashcardListFromStorage } from "./flashcard";
import { randomInteger } from "app/utilities/common";
import { select as allSelect } from "..";
import { keyBy } from "lodash";

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

// TODO - This is terrible. I'm just doing this because I'm lazy.
const getCardMapFromFetch = async () => {
  const list: FlashcardData[] = await new GetRequest(ApiPath.Flashcard, {
    params: { filter: defaultFlashcardFilterData },
  }).exec();

  const map = keyBy(list, "id");

  return { map };
};

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
    types.createFlashcardDeck.createAction(null, async (dispatch, getState) => {
      const list: FlashcardData[] = allSelect.isLocalSession(getState())
        ? getFlashcardListFromStorage(filter)
        : await new GetRequest(ApiPath.Flashcard, {
            params: { filter },
          }).exec();
      storeStorageItem(STORAGE_KEY, {
        flashcardIdList: list.map((card) => card.id),
      });
      return { filter, cardCount: list.length };
    }),

  loadMaxHitPercentage: (deckId: 0) =>
    types.loadMaxHitPercentage.createAction(
      null,
      async (dispatch, getState) => {
        const { map: cardMap } = allSelect.isLocalSession(getState())
          ? fetchCardMap()
          : await getCardMapFromFetch();
        const { flashcardIdList } = fetchDeck();
        return flashcardIdList.reduce((maxHitPercentage, id) => {
          const currentHitPercentage = getHitPercentage(cardMap[id]);
          return currentHitPercentage > maxHitPercentage
            ? currentHitPercentage
            : maxHitPercentage;
        }, 0);
      }
    ),

  // TODO - Add the concept of multiple decks
  pickFlashcard: (deckId: 0) =>
    types.pickFlashcard.createAction(null, async (dispatch, getState) => {
      const { flashcardIdList } = fetchDeck();
      const { map } = allSelect.isLocalSession(getState())
        ? fetchCardMap()
        : await getCardMapFromFetch();

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
  types.createFlashcardDeck.createReducer({
    success: (state, { filter, cardCount }) => {
      return { ...state, activeFilter: filter, deckSize: cardCount };
    },
  }),
  types.loadMaxHitPercentage.createReducer({
    success: (state, maxHitPercentage) => {
      return { ...state, maxHitPercentage };
    },
  }),

  types.pickFlashcard.createReducer({
    success: (state, id) => {
      return {
        ...state,
        activeCardId: id,
        practiceHistory: [id, ...state.practiceHistory],
      };
    },
  }),
]);
