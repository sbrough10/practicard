import React from "react";
import { IconBase, IconBaseProps } from "./IconBase";

export const EllipsesIcon: React.FC<IconBaseProps> = (props) => (
  <IconBase {...props}>
    <ellipse cx="344" cy="200" rx="56" ry="56"></ellipse>
    <ellipse cx="55.72" cy="196.945" rx="56" ry="56"></ellipse>
    <ellipse cx="200" cy="200" rx="56" ry="56"></ellipse>
  </IconBase>
);
