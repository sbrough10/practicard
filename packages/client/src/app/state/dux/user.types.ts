import { UserData } from "practicard-shared";
import { ActionType, AsyncActionType } from "redux-util";
import { FullState } from "./index.types";

export interface UserState {
  userList?: UserData[];
  isLoading: boolean;
}

export const types = {
  loadUserList: new AsyncActionType<FullState, null, UserData[], unknown>(
    "user.loadAll"
  ),
  createUser: new AsyncActionType<FullState, null, UserData, unknown>(
    "user.create"
  ),
};
