import {
  addItemBatch,
  batchResolver,
  BatchWithItemList,
  createSliceReducer,
  getBatchListByIdList,
  getItemsWithBatch,
} from "redux-util";
import { types, FlashcardState, FlashcardQuery } from "./flashcard.types";
import {
  FlashcardData,
  FlashcardFilterData,
  FlashcardTagData,
} from "../../utilities/types";
import { FullState } from "./index.types";
import _ from "lodash";
import {
  loadStorageItem,
  storeStorageItem,
} from "../../utilities/local-storage";
import { getHitPercentage } from "app/utilities/common";

const InitialState: FlashcardState = {
  byId: {},
  batchMap: {},
  recentlyCreated: [],
  markedForDeletion: [],
};

const STORAGE_KEY = "flashcardsV1";

interface StorageFormatV1 {
  map: FlashcardState["byId"];
  lastId: number;
}

export const fetchCardMap = (): StorageFormatV1 =>
  loadStorageItem(STORAGE_KEY) ?? { map: {}, lastId: -1 };

export const getFlashcardListFromStorage = (
  filter: FlashcardFilterData | undefined
) => {
  const { map } = fetchCardMap();
  let list = Object.values(map);
  if (filter) {
    const { include } = filter;
    if (include.text) {
      const text = include.text.toLowerCase();
      list = list.filter(
        (card) =>
          card.frontText.toLowerCase().indexOf(text) > -1 ||
          card.backText.toLowerCase().indexOf(text) > -1
      );
    }
    if (include.onlyNoTag) {
      list = list.filter((card) => card.tagIdList.length === 0);
    } else if (include.tagIdList.length > 0) {
      list = list.filter((card) => {
        return (
          (include.noTag && card.tagIdList.length === 0) ||
          include.tagIdList.some(
            (tagId) => card.tagIdList.indexOf(tagId) !== -1
          )
        );
      });
    }
    if (include.maxHitPercentage < 100) {
      list = list.filter(
        (card) => getHitPercentage(card) < include.maxHitPercentage
      );
    }
  }
  return list;
};

const deleteFlashcardList = (
  map: FlashcardState["byId"],
  flashcardIdList: FlashcardData["id"][]
) => {
  flashcardIdList.forEach((id) => {
    delete map[id];
  });
};

const addTagToFlashcardList = (
  map: FlashcardState["byId"],
  tagId: FlashcardTagData["id"],
  flashcardIdList: FlashcardData["id"][]
) => {
  flashcardIdList.forEach((id) => {
    const flashcard = map[id];
    if (!flashcard) {
      throw Error("Flaschard does not exist");
    }
    const { tagIdList } = flashcard;
    if (tagIdList.indexOf(tagId) === -1) {
      tagIdList.push(tagId);
    }
  });
};

const removeTagFromFlashcardList = (
  map: FlashcardState["byId"],
  tagId: FlashcardTagData["id"],
  flashcardIdList: FlashcardData["id"][]
) => {
  flashcardIdList.forEach((id) => {
    const flashcard = map[id];
    if (!flashcard) {
      throw Error("Flaschard does not exist");
    }
    const { tagIdList } = flashcard;
    const tagIndex = tagIdList.indexOf(tagId);
    if (tagIndex !== -1) {
      tagIdList.splice(tagIndex, 1);
    }
  });
};

export const action = {
  loadFlashcard: (id: FlashcardData["id"]) =>
    types.loadFlashcard.createAction(() => {
      const { map } = fetchCardMap();
      return map[id];
    }),
  loadFlashcardList: (query: FlashcardQuery) =>
    types.loadFlashcardList.createAction(() => {
      const list = getFlashcardListFromStorage(query.filter);
      return { list, query };
    }),

  createFlashcardList: (data: Partial<Omit<FlashcardData, "id">>[] = [{}]) =>
    types.createFlashcardList.createAction((dispatch) => {
      const { map, lastId } = fetchCardMap();
      let index: number;
      const newFlaschardList: FlashcardData[] = [];
      for (index = 0; index < data.length; index++) {
        const card: FlashcardData = {
          id: index + lastId,
          frontText: "",
          backText: "",
          hits: 0,
          misses: 1,
          tagIdList: [],
          ...data[index],
        };
        map[card.id] = card;
        newFlaschardList.push(card);
      }
      storeStorageItem(STORAGE_KEY, { map, lastId: lastId + index });

      setTimeout(() => {
        dispatch(
          action.removeFlashcardFromRecentlyCreated(
            newFlaschardList.map((card) => card.id)
          )
        );
      }, 500);

      return newFlaschardList;
    }),

  removeFlashcardFromRecentlyCreated: (idList: FlashcardData["id"][]) =>
    types.removeFlashcardListFromRecentlyCreated.createAction(() => idList),

  updateFlashcard: (id: FlashcardData["id"], data: Partial<FlashcardData>) =>
    types.updateFlashcard.createAction(() => {
      const { map, lastId } = fetchCardMap();
      const flashcard = map[id];
      map[id] = { ...flashcard, ...data };
      storeStorageItem(STORAGE_KEY, { map, lastId });
      return { id, data };
    }),

  deleteFlashcardList: (idList: FlashcardData["id"][]) =>
    types.markFlashcardListForDeletion.createAction((dispatch) => {
      const { map, lastId } = fetchCardMap();
      deleteFlashcardList(map, idList);
      storeStorageItem(STORAGE_KEY, { map, lastId });
      setTimeout(() => {
        dispatch(action.finalizeFlashcardListDeletion());
      }, 0);
      return idList;
    }),

  finalizeFlashcardListDeletion: () =>
    types.finalizeFlashcardListDeletion.createAction(() => {}),

  addTagToFlashcardList: (
    tagId: FlashcardTagData["id"],
    flashcardIdList: FlashcardData["id"][]
  ) =>
    types.addTagToFlashcardList.createAction(() => {
      const { map, lastId } = fetchCardMap();
      addTagToFlashcardList(map, tagId, flashcardIdList);
      storeStorageItem(STORAGE_KEY, { map, lastId });
      return { tagId, flashcardIdList };
    }),

  removeTagFromFlashcardList: (
    tagId: FlashcardTagData["id"],
    flashcardIdList: FlashcardData["id"][]
  ) =>
    types.removeTagFromFlashcardList.createAction(() => {
      const { map, lastId } = fetchCardMap();
      removeTagFromFlashcardList(map, tagId, flashcardIdList);
      storeStorageItem(STORAGE_KEY, { map, lastId });
      return { tagId, flashcardIdList };
    }),
};

export const select = {
  getFlashcardById: (
    state: FullState,
    id: FlashcardData["id"]
  ): FlashcardData | undefined => {
    return state.flashcard.byId[id];
  },

  // TODO - Use reselect or equivalent to cache the array object
  getFlashcardBatchByQuery: (
    state: FullState,
    query: FlashcardQuery
  ): BatchWithItemList<FlashcardData> | undefined => {
    const batchList = batchResolver(state.flashcard, query);

    // We only care about the first batch because we assume there is only one for now
    const batch = batchList[0];
    if (batch) {
      return getItemsWithBatch(state.flashcard, batch);
    }
    return undefined;
  },

  isFlashcardRecentlyCreated: (state: FullState, id: FlashcardData["id"]) => {
    return state.flashcard.recentlyCreated.indexOf(id) > -1;
  },
};

export const reducer = createSliceReducer(InitialState, [
  types.loadFlashcard.createReducer((state, flashcard) => {
    state.byId[flashcard.id] = flashcard;
    return state;
  }),

  types.loadFlashcardList.createReducer((state, { list, query }) => {
    addItemBatch(state, query, list);

    return state;
  }),

  types.createFlashcardList.createReducer((state, flashcardList) => {
    flashcardList.forEach((card) => {
      state.byId[card.id] = card;
    });

    batchResolver(state, {}).forEach((batch) => {
      batch.isValid = false;
    });

    state.recentlyCreated.push(...flashcardList.map((card) => card.id));

    return state;
  }),

  types.removeFlashcardListFromRecentlyCreated.createReducer(
    (state, idList) => {
      idList.forEach((id) => {
        const index = state.recentlyCreated.indexOf(id);
        if (index > -1) {
          state.recentlyCreated.splice(index, 1);
        }
      });
      return state;
    }
  ),

  types.updateFlashcard.createReducer((state, { id, data }) => {
    Object.assign(state.byId[id], data);

    batchResolver(state, {}).forEach((batch) => {
      batch.isValid = false;
    });

    return state;
  }),

  types.markFlashcardListForDeletion.createReducer((state, idList) => {
    state.markedForDeletion = [...state.markedForDeletion, ...idList];
    return state;
  }),

  types.finalizeFlashcardListDeletion.createReducer((state) => {
    getBatchListByIdList(state, state.markedForDeletion).forEach((batch) => {
      batch.isValid = false;
    });

    return state;
  }),

  types.addTagToFlashcardList.createReducer(
    (state, { tagId, flashcardIdList }) => {
      getBatchListByIdList(state, flashcardIdList).forEach((batch) => {
        batch.isValid = false;
      });
      return state;
    }
  ),

  types.removeTagFromFlashcardList.createReducer(
    (state, { tagId, flashcardIdList }) => {
      getBatchListByIdList(state, flashcardIdList).forEach((batch) => {
        batch.isValid = false;
      });
      return state;
    }
  ),
]);
