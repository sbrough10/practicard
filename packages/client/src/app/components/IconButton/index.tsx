import React from "react";
import { Button, ButtonProps } from "../Button";
import { classes } from "./styles";
import clsx from "clsx";

export interface IconButtonProps extends ButtonProps {
  icon: React.ReactNode;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  children,
  ...buttonProps
}) => {
  return (
    <Button
      {...buttonProps}
      className={clsx(classes.root, buttonProps.className)}
    >
      {icon}
      {children}
    </Button>
  );
};
