import { GetRequest, createSliceReducer } from "redux-util";
import { ApiPath, WorkspaceData } from "practicard-shared";
import { FullState } from "./index.types";
import { WorkspaceState, types } from "./workspace.types";
import { types as sessionTypes } from "./session.types";

export const InitialState: WorkspaceState = {
  isLoading: false,
};

export const action = {
  loadWorkspaceList: () =>
    types.loadWorkspaceList.createAction(null, async () => {
      const req = new GetRequest(ApiPath.Workspace);
      const workspaceList: WorkspaceData[] = await req.exec();
      return workspaceList;
    }),
};

export const reducer = createSliceReducer(InitialState, [
  types.loadWorkspaceList.createReducer({
    pending: (state) => {
      state.isLoading = true;
      return state;
    },
    success: (state, workspaceList) => {
      state.isLoading = false;
      state.workspaceList = workspaceList;
      return state;
    },
    failure: (state) => {
      state.isLoading = false;
      return state;
    },
  }),

  sessionTypes.startSession.createReducer({
    success: (state) => ({ ...state, workspaceList: undefined }),
  }),
]);

export const select = {
  getWorkspaceList: (state: FullState) => state.workspace.workspaceList,
  isLoadingWorkspaceList: (state: FullState) => state.user.isLoading,
};
