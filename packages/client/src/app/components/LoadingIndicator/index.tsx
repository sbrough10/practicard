import { GearIcon } from "app/icons/GearIcon";
import React from "react";
import { classes } from "./styles";

export interface LoadingIndicatorProps {}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = () => {
  return (
    <div className={classes.root}>
      <GearIcon />
    </div>
  );
};
