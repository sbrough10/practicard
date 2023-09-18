import { GetRequest, PostRequest, createSliceReducer } from "redux-util";
import { UserState, types } from "./user.types";
import { types as sessionTypes } from "./session.types";
import { ApiPath, UserData } from "practicard-shared";
import { FullState } from "./index.types";

export const InitialState: UserState = {
  isLoading: false,
};

export const action = {
  loadUserList: () =>
    types.loadUserList.createAction(null, async () => {
      const req = new GetRequest(ApiPath.User);
      const userList: UserData[] = await req.exec();
      return userList;
    }),
  createUser: (displayName: string) =>
    types.createUser.createAction(null, async () => {
      const req = new PostRequest(ApiPath.User, { body: displayName });
      const newUser: UserData = await req.exec();
      return newUser;
    }),
};

export const reducer = createSliceReducer(InitialState, [
  types.loadUserList.createReducer({
    pending: (state) => {
      state.isLoading = true;
      return state;
    },
    success: (state, userList) => {
      state.isLoading = false;
      state.userList = userList;
      return state;
    },
    failure: (state) => {
      state.isLoading = false;
      return state;
    },
  }),

  types.createUser.createReducer({
    success: (state, user) => {
      return { ...state, userList: [...(state.userList ?? []), user] };
    },
  }),

  sessionTypes.startSession.createReducer({
    success: (state) => ({ ...state, userList: undefined }),
  }),
]);

export const select = {
  getUserList: (state: FullState) => state.user.userList,
  isLoadingUserList: (state: FullState) => state.user.isLoading,
};
