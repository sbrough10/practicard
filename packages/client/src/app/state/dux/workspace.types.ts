import { WorkspaceData } from "practicard-shared";
import { AsyncActionType } from "redux-util";
import { FullState } from "./index.types";

export interface WorkspaceState {
  workspaceList?: WorkspaceData[];
  isLoading: boolean;
}

export const types = {
  loadWorkspaceList: new AsyncActionType<
    FullState,
    null,
    WorkspaceData[],
    unknown
  >("workspace.loadAll"),
};
