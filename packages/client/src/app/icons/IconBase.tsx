import React, { PropsWithChildren } from "react";
import { DEFAULT_ICON_COLOR } from "../utilities/styles";

export interface IconBaseProps {
  size?: number;
  fillColor?: string;
}

export const IconBase: React.FC<PropsWithChildren<IconBaseProps>> = ({
  size = 40,
  fillColor = DEFAULT_ICON_COLOR,
  children,
}) => {
  return (
    <svg
      width={`${size}px`}
      height={`${size}px`}
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      fill={fillColor}
    >
      {children}
    </svg>
  );
};
