import { ActionType, AsyncActionType } from "redux-util";
import { FullState } from "./index.types";

export interface SessionState {
  hasSession?: boolean;
  isLocal: boolean;
  isLoading: boolean;
}

export const types = {
  startSession: new AsyncActionType<FullState, null, boolean, unknown>(
    "session.create"
  ),
  startLocalSession: new ActionType<FullState, null>("session.createLocal"),
  loadSession: new AsyncActionType<FullState, null, boolean, unknown>(
    "session.load"
  ),
  endSession: new AsyncActionType<FullState, null, null, unknown>(
    "session.delete"
  ),
};
