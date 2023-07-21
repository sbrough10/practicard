import React from "react";
import { IconBase, IconBaseProps } from "./IconBase";

export const FlipIcon: React.FC<IconBaseProps> = (props) => (
  <IconBase {...props}>
    <path d="M 80 0 L 400 0 L 400 320 L 320 320 L 320 400 L 0 400 L 0 80 L 80 80 Z M 80 320 L 80 96 L 16 96 L 16 384 L 304 384 L 304 320 Z M 96.891 304.632 L 384.891 304.632 L 384.891 16.632 L 96.891 16.632 Z"></path>
  </IconBase>
);
