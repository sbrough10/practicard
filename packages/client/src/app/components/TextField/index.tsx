import React, { PropsWithRef, forwardRef } from "react";
import { classes } from "./styles";
import clsx from "clsx";

export interface TextFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  ref: React.LegacyRef<HTMLInputElement>;
  leftPadContent?: React.ReactNode;
  rightPadContent?: React.ReactNode;
}

export const TextField: React.FC<PropsWithRef<TextFieldProps>> = forwardRef<
  HTMLInputElement,
  TextFieldProps
>(({ leftPadContent, rightPadContent, className, ...props }, ref) => {
  return (
    <div className={clsx(classes.root, className)}>
      {leftPadContent}
      <input type="text" {...props} className={classes.input} ref={ref} />
      {rightPadContent}
    </div>
  );
});
