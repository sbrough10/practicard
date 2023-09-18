import { TextField } from "app/components/TextField";
import { classes } from "./styles";
import React, { useCallback, useState } from "react";
import { Button } from "@mui/material";
import { SelectDropdown } from "app/components/SelectDropdown";
import {
  SessionCreationParams,
  UserData,
  WorkspaceData,
} from "practicard-shared";
import {
  useStartLocalSession,
  useStartSession,
  useUserList,
  useWorkspaceList,
} from "app/state";

export interface WorkspaceSelectorViewProps {
  onPickUserAndWorkspace: (
    userId: UserData["id"],
    workspace: WorkspaceData["id"]
  ) => void;
}

export const WorkspaceSelectorView: React.FC = () => {
  const [userDisplayName, setUserDisplayName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [workspaceDisplayName, setWorkspaceDisplayName] = useState("");
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(0);

  const userList = useUserList();
  const workspaceList = useWorkspaceList();
  const startSession = useStartSession();
  const startLocalSession = useStartLocalSession();

  const changeUserDisplayName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setUserDisplayName(event.target.value);
    },
    []
  );

  const changeSelectedUserId = useCallback((userId: UserData["id"]) => {
    setSelectedUserId(userId);
  }, []);

  const changeWorkspaceDisplayName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setWorkspaceDisplayName(event.target.value);
    },
    []
  );

  const changeSelectedWorkspaceId = useCallback(
    (workspaceId: WorkspaceData["id"]) => {
      setSelectedWorkspaceId(workspaceId);
    },
    []
  );

  const onPickUserAndWorkspace = useCallback(() => {
    const params: SessionCreationParams = {
      user:
        selectedUserId === 0
          ? { displayName: userDisplayName }
          : { id: selectedUserId },
      workspace:
        selectedWorkspaceId === 0
          ? { displayName: workspaceDisplayName }
          : { id: selectedWorkspaceId },
    };

    startSession(params);
  }, [
    selectedUserId,
    userDisplayName,
    selectedWorkspaceId,
    workspaceDisplayName,
  ]);

  const userOptionList = [
    { value: 0, label: "None Selected" },
    ...(userList
      ? userList.map((user) => ({
          value: user.id,
          label: `${user.id} - ${user.displayName}`,
        }))
      : []),
  ];

  const workspaceOptionList = [
    { value: 0, label: "None Selected" },
    ...(workspaceList
      ? workspaceList.map((workspace) => ({
          value: workspace.id,
          label: `${workspace.id} - ${workspace.displayName}`,
        }))
      : []),
  ];

  const isEntryDisabled =
    (selectedUserId === 0 && userDisplayName === "") ||
    (selectedWorkspaceId === 0 && workspaceDisplayName === "");

  return (
    <div className={classes.root}>
      <div>Create a user</div>
      <div>
        <TextField
          disabled={selectedUserId !== 0}
          onChange={changeUserDisplayName}
          value={userDisplayName}
        />
      </div>
      <div>Or pick an existing one</div>
      <div>
        <SelectDropdown
          optionList={userOptionList}
          onSelect={changeSelectedUserId}
          selected={selectedUserId}
        />
      </div>
      <div>Create a flashcard workspace</div>
      <div>
        <TextField
          disabled={selectedWorkspaceId !== 0}
          onChange={changeWorkspaceDisplayName}
          value={workspaceDisplayName}
        />
      </div>
      <div>Or pick an existing one</div>
      <div>
        <SelectDropdown
          optionList={workspaceOptionList}
          onSelect={changeSelectedWorkspaceId}
          selected={selectedWorkspaceId}
        />
      </div>
      <div>
        <Button onClick={onPickUserAndWorkspace} disabled={isEntryDisabled}>
          Enter workspace
        </Button>
      </div>
      <div>Or</div>
      <div>
        <Button onClick={startLocalSession}>Enter local workspace</Button>
      </div>
    </div>
  );
};
