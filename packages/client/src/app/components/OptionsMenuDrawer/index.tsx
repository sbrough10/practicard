import { Drawer } from "@mui/material";
import React from "react";
import { classes } from "./styles";

export interface OptionsMenuDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const OptionsMenuDrawer: React.FC<OptionsMenuDrawerProps> = ({
  open,
  onClose,
}) => {
  return (
    <Drawer
      open={open}
      className={classes.root}
      onClose={onClose}
      anchor="left"
      ModalProps={{ keepMounted: true }}
    ></Drawer>
  );
};
