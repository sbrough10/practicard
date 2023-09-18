import { useEffect } from "react";
import { action, select, useDispatch } from "..";
import { useSelector } from "react-redux";

export const useWorkspaceList = () => {
  const dispatch = useDispatch();

  const workspaceList = useSelector(select.getWorkspaceList);
  const isLoading = useSelector(select.isLoadingWorkspaceList);

  useEffect(() => {
    if (!isLoading && !workspaceList) {
      dispatch(action.loadWorkspaceList());
    }
  }, [workspaceList, isLoading]);

  return workspaceList;
};
