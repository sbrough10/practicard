import { Dialog } from "@mui/material";
import React, { PropsWithChildren } from "react";
import { classes } from "./styles";
import { ExIcon } from "../../icons/ExIcon";
import { IconButton } from "../IconButton";

export interface BasePopupViewProps {
  title: string;
  onClose: () => void;
}

export const BasePopupView: React.FC<PropsWithChildren<BasePopupViewProps>> = ({
  title,
  onClose,
  children,
}) => {
  return (
    <Dialog open={true} onClose={onClose} className={classes.root}>
      {/* <div className={classes.wrapper}> */}
      <div className={classes.header}>
        <h3 className={classes.title}>{title}</h3>
        <IconButton
          className={classes.closeButton}
          icon={<ExIcon size={22} fillColor="black" />}
          onClick={onClose}
        />
      </div>
      {children}
      {/* </div> */}
    </Dialog>
  );
};
