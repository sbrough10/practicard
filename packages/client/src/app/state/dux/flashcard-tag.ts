import { createSliceReducer } from "redux-util";
import { FlashcardTagData } from "../../utilities/types";
import { FullState } from "./index.types";
import {
  FlashcardTagMap,
  FlashcardTagState,
  types,
} from "./flashcard-tag.types";
import {
  loadStorageItem,
  storeStorageItem,
} from "../../utilities/local-storage";

const InitialState: FlashcardTagState = {
  map: undefined,
  isLoading: false,
};

const STORAGE_KEY = "flashcardTagV1";

interface StorageFormatV1 {
  map: FlashcardTagMap;
  lastId: number;
}

const fetchTagMap = (): StorageFormatV1 =>
  loadStorageItem(STORAGE_KEY) ?? { map: {}, lastId: -1 };

export const action = {
  loadFlashcardTagMap: () =>
    types.loadFlashcardTagMap.createAction(() => {
      return fetchTagMap().map;
    }),

  createFlashcardTag: (label: string) =>
    types.createFlashcardTag.createAction(() => {
      const { map, lastId } = fetchTagMap();
      const id = lastId + 1;
      const newTag: FlashcardTagData = {
        id,
        label,
      };
      map[id] = newTag;
      storeStorageItem(STORAGE_KEY, { map, lastId: id });
      return newTag;
    }),

  updateFlashcardTag: ({ id, label }: FlashcardTagData) =>
    types.updateFlashcardTag.createAction(() => {
      const { map, lastId } = fetchTagMap();
      const tag = map[id];
      map[id] = { id, label };
      storeStorageItem(STORAGE_KEY, { map, lastId });
      return tag;
    }),
};

export const select = {
  getFlashcardTagMap: (state: FullState): FlashcardTagMap | undefined => {
    return state.flashcardTag.map;
  },
};

export const reducer = createSliceReducer(InitialState, [
  types.loadFlashcardTagMap.createReducer((state, data) => {
    state.map = data;

    return state;
  }),

  types.createFlashcardTag.createReducer((state, data) => {
    state.map = { ...state.map, [data.id]: data };

    return state;
  }),

  types.updateFlashcardTag.createReducer((state, data) => {
    state.map = { ...state.map, [data.id]: data };

    return state;
  }),
]);
