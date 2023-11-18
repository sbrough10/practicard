import React from "react";
import { classes } from "./styles";
import clsx from "clsx";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button: React.FC<ButtonProps> = (props) => {
  return (
    <button {...props} className={clsx(classes.root, props.className)}>
      {props.children}
    </button>
  );
};
