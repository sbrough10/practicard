import {
  GetRequest,
  PostRequest,
  PutRequest,
  createSliceReducer,
} from "redux-util";
import { ApiPath, FlashcardTagData } from "practicard-shared";
import { FullState } from "./index.types";
import {
  FlashcardTagMap,
  FlashcardTagState,
  types,
} from "./flashcard-tag.types";
import { types as flashcardTypes } from "./flashcard.types";
import { types as sessionTypes } from "./session.types";
import { loadStorageItem, storeStorageItem } from "app/utilities/local-storage";
import { select as allSelect } from "..";

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

export const createTagList = (labelList: string[]) => {
  const { map, lastId } = fetchTagMap();
  const newTagList = labelList.map((label, index) => {
    const id = lastId + 1 + index;
    const newTag: FlashcardTagData = {
      id,
      label,
    };
    map[id] = newTag;
    return newTag;
  });
  storeStorageItem(STORAGE_KEY, { map, lastId: newTagList.length + lastId });
  return newTagList;
};

export const action = {
  queueLoadFlashcardTagMap: () =>
    types.queueLoadFlashcardTagMap.createAction((dispatch, getState) => {
      if (!select.isFlashcardTagMapLoading(getState())) {
        dispatch(action.loadFlashcardTagMap());
      }
    }),
  loadFlashcardTagMap: () =>
    types.loadFlashcardTagMap.createAction(null, async (dispatch, getState) => {
      if (allSelect.isLocalSession(getState())) {
        return fetchTagMap().map;
      }
      const req = new GetRequest(ApiPath.FlashcardTag);
      return await req.exec();
    }),

  createFlashcardTag: (label: string) =>
    types.createFlashcardTag.createAction(null, async (dispatch, getState) => {
      if (allSelect.isLocalSession(getState())) {
        return createTagList([label])[0];
      }
      const req = new PostRequest(ApiPath.FlashcardTag, {
        body: { labelList: [label] },
      });
      return (await req.exec())[0];
    }),

  updateFlashcardTag: ({ id, label }: FlashcardTagData) =>
    types.updateFlashcardTag.createAction(null, async (dispatch, getState) => {
      const tag = { id, label };
      if (allSelect.isLocalSession(getState())) {
        const { map, lastId } = fetchTagMap();
        map[id] = tag;
        storeStorageItem(STORAGE_KEY, { map, lastId });
      } else {
        const req = new PutRequest(ApiPath.FlashcardTagById, {
          params: { tagId: id },
          body: { label },
        });
        await req.exec();
      }
      return tag;
    }),

  deleteFlashcardTag: {},
};

export const select = {
  getFlashcardTagMap: (state: FullState): FlashcardTagMap | undefined => {
    return state.flashcardTag.map;
  },
  isFlashcardTagMapLoading: (state: FullState): boolean => {
    return state.flashcardTag.isLoading;
  },
};

export const reducer = createSliceReducer(InitialState, [
  types.loadFlashcardTagMap.createReducer({
    pending: (state) => {
      state.isLoading = true;
      return state;
    },
    success: (state, data) => {
      state.map = data;
      state.isLoading = false;

      return state;
    },
    failure: (state) => {
      state.isLoading = false;
      return state;
    },
  }),

  types.createFlashcardTag.createReducer({
    success: (state, data) => {
      state.map = { ...state.map, [data.id]: data };

      return state;
    },
  }),

  types.updateFlashcardTag.createReducer({
    success: (state, data) => {
      state.map = { ...state.map, [data.id]: data };

      return state;
    },
  }),

  flashcardTypes.createFlashcardListFromNewTagMap.createReducer({
    success: (state, data) => {
      const { map } = state;
      if (!map) {
        throw Error(
          "There is no way the tag map should be undefined at this point"
        );
      }
      data.forEach((tag) => {
        map[tag.id] = tag;
      });

      return state;
    },
  }),

  sessionTypes.endSession.createReducer({
    success: (state) => {
      state = InitialState;
      return state;
    },
  }),
]);
