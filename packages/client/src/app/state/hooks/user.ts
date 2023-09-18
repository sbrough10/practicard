import { useCallback, useEffect } from "react";
import { action, select, useDispatch, useSelector } from "..";

export const useUserList = () => {
  const dispatch = useDispatch();

  const userList = useSelector(select.getUserList);
  const isLoading = useSelector(select.isLoadingUserList);

  useEffect(() => {
    if (!isLoading && !userList) {
      dispatch(action.loadUserList());
    }
  }, [userList, isLoading]);

  return userList;
};

export const useCreateUser = () => {
  const dispatch = useDispatch();

  return useCallback(
    (displayName: string) => {
      dispatch(action.createUser(displayName));
    },
    [dispatch]
  );
};
