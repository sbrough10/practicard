import {
  DeleteRequest,
  GetRequest,
  PostRequest,
  createSliceReducer,
} from "redux-util";
import { ApiPath, SessionCreationParams } from "practicard-shared";
import { FullState } from "./index.types";
import { SessionState, types } from "./session.types";

export const InitialState: SessionState = {
  isLocal: false,
  isLoading: false,
};

export const action = {
  startSession: (params: SessionCreationParams) =>
    types.startSession.createAction(null, async () => {
      const req = new PostRequest(ApiPath.Session, { body: params });
      await req.exec();
      return true;
    }),

  startLocalSession: () =>
    types.startLocalSession.createAction(() => {
      return null;
    }),

  loadSession: () =>
    types.loadSession.createAction(null, async () => {
      const req = new GetRequest(ApiPath.Session);
      const { hasSession } = await req.exec();
      return hasSession;
    }),

  endSession: () =>
    types.endSession.createAction(null, async (dispatch, getState) => {
      if (select.isLocalSession(getState())) {
        return null;
      }
      const req = new DeleteRequest(ApiPath.Session);
      await req.exec();
      return null;
    }),
};

export const reducer = createSliceReducer(InitialState, [
  types.startSession.createReducer({
    pending: (state) => ({ ...state, isLoading: true }),
    success: (state, hasSession) => ({
      ...state,
      hasSession,
      isLocal: false,
      isLoading: false,
    }),
    failure: (state) => ({ ...state, isLoading: false }),
  }),

  types.startLocalSession.createReducer((state) => ({
    ...state,
    hasSession: true,
    isLocal: true,
  })),

  types.loadSession.createReducer({
    pending: (state) => ({ ...state, isLoading: true }),
    success: (state, hasSession) => ({
      ...state,
      hasSession,
      isLocal: false,
      isLoading: false,
    }),
    failure: (state) => ({ ...state, isLoading: false }),
  }),

  types.endSession.createReducer({
    pending: (state) => ({ ...state, isLoading: true }),
    success: (state) => ({ ...state, hasSession: false, isLocal: false }),
    failure: (state) => ({ ...state, isLoading: false }),
  }),
]);

export const select = {
  hasSession: (state: FullState) => state.session.hasSession,
  isLoadingSession: (state: FullState) => state.session.isLoading,
  isLocalSession: (state: FullState) => state.session.isLocal,
};
