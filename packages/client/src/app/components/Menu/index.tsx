import React from "react";
import { Menu as MuiMenu, MenuProps as MuiMenuProps } from "@mui/material";
import { classes } from "./styles";

export interface MenuProps extends MuiMenuProps {
  onClose: () => void;
}

export const Menu: React.FC<MenuProps> = ({ onClose, ...props }) => {
  return (
    <MuiMenu
      className={classes.root}
      onClick={onClose}
      onClose={onClose}
      anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      transformOrigin={{ horizontal: "center", vertical: "top" }}
      {...props}
    />
  );
};
