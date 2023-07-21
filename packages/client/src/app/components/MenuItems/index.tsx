import React from "react";
import {
  MenuItem as MuiMenuItem,
  MenuItemProps as MuiMenuItemProps,
} from "@mui/material";
import { classes } from "./styles";

export interface MenuItemProps
  extends Omit<MuiMenuItemProps, "disableRipple"> {}

export const MenuItem: React.FC<MenuItemProps> = (props) => {
  return <MuiMenuItem className={classes.root} {...props} disableRipple />;
};
