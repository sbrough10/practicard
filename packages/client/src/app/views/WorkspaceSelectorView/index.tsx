import { TextField } from "app/components/TextField";
import { classes } from "./styles";
import React from "react";
import { Button, IconButton } from "@mui/material";
import { SelectDropdown } from "app/components/SelectDropdown";

export const WorkspaceSelectorView: React.FC = () => {
  return (
    <div className={classes.root}>
      <div>Create a user</div>
      <div>
        <TextField />
        <IconButton />
      </div>
      <div>Or pick an existing one</div>
      <div>
        <SelectDropdown optionList={[]} />
      </div>
      <div>Create a flashcard workspace</div>
      <div>
        <TextField />
        <IconButton />
      </div>
      <div>Or pick an existing one</div>
      <div>
        <SelectDropdown optionList={[]} />
      </div>
      <div>
        <Button>Enter workspace</Button>
      </div>
    </div>
  );
};
