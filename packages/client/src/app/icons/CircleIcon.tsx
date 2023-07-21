import React from "react";
import { IconBase, IconBaseProps } from "./IconBase";

export const FlipIcon: React.FC<IconBaseProps> = (props) => (
  <IconBase {...props}>
    <ellipse cx="200" cy="200" rx="200" ry="200"></ellipse>
  </IconBase>
);
