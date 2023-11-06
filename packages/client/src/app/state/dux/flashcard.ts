import {
  addItemBatch,
  batchResolver,
  BatchWithItemList,
  createSliceReducer,
  DeleteRequest,
  getBatchListByIdList,
  getItemsWithBatch,
  GetRequest,
  PostRequest,
  PutRequest,
  setItemBatchStatus,
} from "redux-util";
import { types, FlashcardState, FlashcardQuery } from "./flashcard.types";
import { types as sessionTypes } from "./session.types";
import {
  FlashcardData,
  FlashcardFilterData,
  FlashcardTagData,
  FlashcardCreationData,
  NewTagToFlashcardMap,
  getHitPercentage,
  ApiPath,
  defaultFlashcardData,
} from "practicard-shared";
import { FullState } from "./index.types";
import _ from "lodash";
import {
  loadStorageItem,
  storeStorageItem,
} from "../../utilities/local-storage";
import { createTagList } from "./flashcard-tag";
import { select as allSelect } from "..";
import { runStandardFailure } from "./shared";

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
      throw Error("Flashcard does not exist");
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
      throw Error("Flashcard does not exist");
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
    types.loadFlashcard.createAction(
      id,
      async (dispatch, getState) => {
        if (allSelect.isLocalSession(getState())) {
          const { map } = fetchCardMap();
          return map[id];
        }
        const req = new GetRequest(ApiPath.FlashcardById, {
          params: { flashcardId: id },
        });
        return await req.exec();
      },
      () => {
        return id;
      }
    ),
  loadFlashcardList: (query: FlashcardQuery) =>
    types.loadFlashcardList.createAction(
      query,
      async (dispatch, getState) => {
        if (allSelect.isLocalSession(getState())) {
          const list = getFlashcardListFromStorage(query.filter);
          return { list, query };
        }
        const req = new GetRequest(ApiPath.Flashcard, { params: query });
        return { list: await req.exec(), query };
      },
      (error) => {
        throw Error("break");
        runStandardFailure(error);
        return query;
      }
    ),

  createFlashcardListWithNewTagMap: (
    tagMap: NewTagToFlashcardMap,
    newCardList: FlashcardCreationData[]
  ) =>
    types.createFlashcardListFromNewTagMap.createAction(
      null,
      async (dispatch, getState) => {
        const tagList: FlashcardTagData[] = allSelect.isLocalSession(getState())
          ? createTagList(Object.keys(tagMap))
          : Object.values(
              await new PostRequest(ApiPath.FlashcardTag, {
                body: { labelList: Object.keys(tagMap) },
              }).exec()
            );
        // TODO - This should probably not be handled in separate dispatch requests, but I'm lazy
        tagList.forEach((tag) => {
          tagMap[tag.label].forEach((newCard) => {
            newCard.tagIdList = [...(newCard.tagIdList ?? []), tag.id];
          });
        });
        dispatch(action.createFlashcardList(newCardList));
        return tagList;
      }
    ),

  createFlashcardList: (data: Partial<FlashcardCreationData>[] = [{}]) =>
    types.createFlashcardList.createAction(null, async (dispatch, getState) => {
      const newFlashcardList: FlashcardData[] = [];
      if (allSelect.isLocalSession(getState())) {
        const { map, lastId } = fetchCardMap();
        let index: number;
        for (index = 0; index < data.length; index++) {
          const card: FlashcardData = {
            id: index + lastId,
            ...defaultFlashcardData,
            ...data[index],
          };
          map[card.id] = card;
          newFlashcardList.push(card);
        }
        storeStorageItem(STORAGE_KEY, { map, lastId: lastId + index });
      } else {
        const req = new PostRequest(ApiPath.Flashcard, {
          body: data.map((newCardData) => ({
            ...defaultFlashcardData,
            ...newCardData,
          })),
        });
        newFlashcardList.push(...(await req.exec()));
      }

      setTimeout(() => {
        dispatch(
          action.removeFlashcardFromRecentlyCreated(
            newFlashcardList.map((card) => card.id)
          )
        );
      }, 500);

      return newFlashcardList;
    }),

  removeFlashcardFromRecentlyCreated: (idList: FlashcardData["id"][]) =>
    types.removeFlashcardListFromRecentlyCreated.createAction(() => idList),

  updateFlashcard: (id: FlashcardData["id"], data: Partial<FlashcardData>) =>
    types.updateFlashcard.createAction(null, async (dispatch, getState) => {
      if (allSelect.isLocalSession(getState())) {
        const { map, lastId } = fetchCardMap();
        const flashcard = map[id];
        map[id] = { ...flashcard, ...data };
        storeStorageItem(STORAGE_KEY, { map, lastId });
      } else {
        const req = new PutRequest(ApiPath.FlashcardById, {
          params: { flashcardId: id },
          body: data,
        });
        await req.exec();
      }
      return { id, data };
    }),

  deleteFlashcardList: (idList: FlashcardData["id"][]) =>
    types.markFlashcardListForDeletion.createAction(
      null,
      async (dispatch, getState) => {
        if (allSelect.isLocalSession(getState())) {
          const { map, lastId } = fetchCardMap();
          deleteFlashcardList(map, idList);
          storeStorageItem(STORAGE_KEY, { map, lastId });
        } else {
          const req = new DeleteRequest(ApiPath.Flashcard, {
            body: idList,
          });
          await req.exec();
        }
        setTimeout(() => {
          dispatch(action.finalizeFlashcardListDeletion());
        }, 0);
        return idList;
      }
    ),

  finalizeFlashcardListDeletion: () =>
    types.finalizeFlashcardListDeletion.createAction(() => {}),

  addTagToFlashcardList: (
    tagId: FlashcardTagData["id"],
    flashcardIdList: FlashcardData["id"][]
  ) =>
    types.addTagToFlashcardList.createAction(
      null,
      async (dispatch, getState) => {
        if (allSelect.isLocalSession(getState())) {
          const { map, lastId } = fetchCardMap();
          addTagToFlashcardList(map, tagId, flashcardIdList);
          storeStorageItem(STORAGE_KEY, { map, lastId });
        } else {
          const req = new PutRequest(ApiPath.FlashcardTagIdList, {
            body: {
              addedTagIdList: [tagId],
              removedTagIdList: [],
              flashcardIdList,
            },
          });
          await req.exec();
        }
        return { tagId, flashcardIdList };
      }
    ),

  removeTagFromFlashcardList: (
    tagId: FlashcardTagData["id"],
    flashcardIdList: FlashcardData["id"][]
  ) =>
    types.removeTagFromFlashcardList.createAction(
      null,
      async (dispatch, getState) => {
        if (allSelect.isLocalSession(getState())) {
          const { map, lastId } = fetchCardMap();
          removeTagFromFlashcardList(map, tagId, flashcardIdList);
          storeStorageItem(STORAGE_KEY, { map, lastId });
        } else {
          const req = new PutRequest(ApiPath.FlashcardTagIdList, {
            body: {
              addedTagIdList: [],
              removedTagIdList: [tagId],
              flashcardIdList,
            },
          });
          await req.exec();
        }
        return { tagId, flashcardIdList };
      }
    ),

  changeTagListOnFlashcardList: (
    addedTagIdList: FlashcardTagData["id"][],
    removedTagIdList: FlashcardTagData["id"][],
    flashcardIdList: FlashcardData["id"][]
  ) =>
    types.changeTagListOnFlashcardList.createAction(
      null,
      async (dispatch, getState) => {
        if (allSelect.isLoadingSession(getState())) {
          // TODO - Create local version
          alert("This will not work for local workspaces");
        } else {
          const req = new PutRequest(ApiPath.FlashcardTagIdList, {
            body: {
              addedTagIdList,
              removedTagIdList,
              flashcardIdList,
            },
          });
          await req.exec();
        }

        return { addedTagIdList, removedTagIdList, flashcardIdList };
      }
    ),
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
  types.loadFlashcard.createReducer({
    success: (state, flashcard) => {
      state.byId[flashcard.id] = flashcard;
      return state;
    },
  }),

  types.loadFlashcardList.createReducer({
    pending: (state, query) => {
      setItemBatchStatus(state, query, { isLoading: true });
      return state;
    },
    success: (state, { list, query }) => {
      addItemBatch(state, query, list);
      return state;
    },
    failure: (state, query) => {
      setItemBatchStatus(state, query, { isLoading: false });
      return state;
    },
  }),

  types.createFlashcardList.createReducer({
    success: (state, flashcardList) => {
      flashcardList.forEach((card) => {
        state.byId[card.id] = card;
      });

      batchResolver(state, {}).forEach((batch) => {
        batch.isValid = false;
      });

      state.recentlyCreated.push(...flashcardList.map((card) => card.id));

      return state;
    },
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

  types.updateFlashcard.createReducer({
    success: (state, { id, data }) => {
      Object.assign(state.byId[id], data);

      return state;
    },
  }),

  types.markFlashcardListForDeletion.createReducer({
    success: (state, idList) => {
      state.markedForDeletion = [...state.markedForDeletion, ...idList];
      return state;
    },
  }),

  types.finalizeFlashcardListDeletion.createReducer((state) => {
    getBatchListByIdList(state, state.markedForDeletion).forEach((batch) => {
      batch.isValid = false;
    });

    return state;
  }),

  types.addTagToFlashcardList.createReducer({
    success: (state, { tagId, flashcardIdList }) => {
      getBatchListByIdList(state, flashcardIdList).forEach((batch) => {
        batch.isValid = false;
      });
      return state;
    },
  }),

  types.removeTagFromFlashcardList.createReducer({
    success: (state, { tagId, flashcardIdList }) => {
      getBatchListByIdList(state, flashcardIdList).forEach((batch) => {
        batch.isValid = false;
      });
      return state;
    },
  }),

  types.changeTagListOnFlashcardList.createReducer({
    success: (state, { flashcardIdList }) => {
      getBatchListByIdList(state, flashcardIdList).forEach((batch) => {
        batch.isValid = false;
      });
      return state;
    },
  }),

  sessionTypes.endSession.createReducer({
    success: (state) => {
      const batchList = batchResolver(state, {});

      batchList.forEach(() => {
        setItemBatchStatus(state, {}, { isValid: false });
      });

      return state;
    },
  }),
]);
