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
  minHitPercentage: 1,
  maxHitPercentage: 0,
  practiceHistory: [],
  isPickingNextCard: false,
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

const logPickLogObj = (flashcard: FlashcardData, logObject: any) => {
  logObject.card = flashcard.frontText;
  logObject.cardPercentage = `${Math.floor(
    getHitPercentage(flashcard) * 100
  )}%`;
  console.log("Pick data - ", logObject);
};

interface BestPick {
  card: FlashcardData;
  hitPercentage: number;
}

const pickFlashcard = (
  list: FlashcardData[],
  state: FlashcardDeckState
): FlashcardData | null => {
  if (list.length === 0) {
    return null;
  }
  const logObject: any = {};
  const { minHitPercentage, maxHitPercentage, practiceHistory } = state;
  logObject.minThreshold = minHitPercentage;
  logObject.maxThreshold = maxHitPercentage;
  // Pick a random threshold for hit percentage, under which a card can be picked
  // The threshold can not be higher than the card in the deck with the highest hit percentage
  // It also can't be lower than the card in the deck with the lowest hit percentage
  const pickMaxHitPercentage =
    Math.random() * (maxHitPercentage - minHitPercentage) + minHitPercentage;
  logObject.pickThreshold = `${Math.floor(pickMaxHitPercentage * 100)}%`;
  // If we can't find a card below the desired hit percentage threshold,
  // we can choose from the cards we've looked through and pick the card with the lowest hit percentage
  let bestPick: BestPick | undefined;
  let bestPickWithGap: BestPick | undefined;
  // We want a minimum gap between when cards are picked again
  // This gap is set as the square root of the deck size, rounded down, minus 1
  // Examples:
  // Deck size = 1 -> Gap size = 0
  // Deck size = 2 -> Gap size = 0
  // Deck size = 4 -> Gap size = 1
  // Deck size = 10 -> Gap size = 2
  // Deck size = 100 -> Gap size = 9
  const skipCards = practiceHistory.slice(
    0,
    Math.min(practiceHistory.length, Math.floor(Math.sqrt(list.length) - 1))
  );
  logObject.minPickGap = skipCards.length;
  // There has to be a max number of attempts at picking a card
  // We set this maximum at the number of cards in the deck
  for (let attempt = 0; attempt < list.length; attempt++) {
    logObject.attempts = attempt + 1;
    const index = randomInteger(0, list.length - 1);
    const flashcard = list[index];
    const hitPercentage = getHitPercentage(flashcard);
    // Sometimes the hit percentage threshold for the pick is too low
    // In this case, we identify the card with the lowest hit percentage
    // and that has not been picked too recently
    if (
      skipCards.indexOf(flashcard.id) === -1 &&
      (!bestPickWithGap || bestPickWithGap.hitPercentage > hitPercentage)
    ) {
      bestPickWithGap = { card: flashcard, hitPercentage };
    }
    // This is in case we don't find any cards that are not too recent
    if (!bestPick || bestPick.hitPercentage > hitPercentage) {
      bestPick = { card: flashcard, hitPercentage };
    }
    // If the card meets our initial criteria, pick it
    if (
      skipCards.indexOf(flashcard.id) === -1 &&
      pickMaxHitPercentage >= hitPercentage
    ) {
      const pickGap = practiceHistory.lastIndexOf(flashcard.id);
      if (pickGap < 0) {
        logObject.pickGap = "never";
      } else {
        logObject.pickGap = pickGap;
      }
      logPickLogObj(flashcard, logObject);
      return flashcard;
    }
  }
  // If, after all attempts, we can't find a card meeting our criteria
  // then pick the one with the lowest hit percentage that isn't too recent
  if (bestPickWithGap) {
    const pickGap = practiceHistory.lastIndexOf(bestPickWithGap.card.id);
    if (pickGap < 0) {
      logObject.pickGap = "never";
    } else {
      logObject.pickGap = pickGap;
    }
    logObject.bestPick = `${Math.floor(bestPickWithGap.hitPercentage * 100)}%`;
    logPickLogObj(bestPickWithGap.card, logObject);
    return bestPickWithGap.card;
  }
  // If all cards were too recent, then just pick the one with the lowest hit percentage
  if (bestPick) {
    logObject.bestPick = `${Math.floor(bestPick.hitPercentage * 100)}%`;
    logPickLogObj(bestPick.card, logObject);
    return bestPick.card;
  }
  // If all this fails, somehow, we pick a card at random
  logObject.lastResort = true;
  const flashcard = list[randomInteger(0, list.length - 1)];
  logPickLogObj(flashcard, logObject);
  return flashcard;
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

  loadHitPercentageRange: (deckId: 0) =>
    types.loadHitPercentageRange.createAction(
      null,
      async (dispatch, getState) => {
        const { map: cardMap } = allSelect.isLocalSession(getState())
          ? fetchCardMap()
          : await getCardMapFromFetch();
        const { flashcardIdList } = fetchDeck();
        const range = flashcardIdList.reduce(
          ([minHitPercentage, maxHitPercentage], id) => {
            const currentHitPercentage = getHitPercentage(cardMap[id]);
            return [
              currentHitPercentage < minHitPercentage
                ? currentHitPercentage
                : minHitPercentage,
              currentHitPercentage > maxHitPercentage
                ? currentHitPercentage
                : maxHitPercentage,
            ];
          },
          [1, 0]
        );

        return { min: range[0], max: range[1] };
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
      dispatch(action.loadHitPercentageRange(0));

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
  getIsPickingNextFlashcard: (state: FullState) => {
    return state.flashcardDeck.isPickingNextCard;
  },
};

export const reducer = createSliceReducer(InitialState, [
  types.createFlashcardDeck.createReducer({
    success: (state, { filter, cardCount }) => {
      return { ...state, activeFilter: filter, deckSize: cardCount };
    },
  }),
  types.loadHitPercentageRange.createReducer({
    success: (state, data) => {
      return {
        ...state,
        minHitPercentage: data.min,
        maxHitPercentage: data.max,
      };
    },
  }),

  types.pickFlashcard.createReducer({
    pending: (state, id) => ({ ...state, isPickingNextCard: true }),
    success: (state, id) => {
      return {
        ...state,
        activeCardId: id,
        practiceHistory: [id, ...state.practiceHistory],
        isPickingNextCard: false,
      };
    },
    failure: (state, id) => ({ ...state, isPickingNextCard: false }),
  }),
]);
