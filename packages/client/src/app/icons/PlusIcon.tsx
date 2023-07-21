import React from "react";
import { IconBaseProps, IconBase } from "./IconBase";

export const PlusIcon: React.FC<IconBaseProps> = (props) => (
  <IconBase {...props}>
    <path d="M 160 0 H 240 V 160 H 400 V 240 H 240 V 400 H 160 V 240 H 0 V 160 H 160 Z"></path>
  </IconBase>
);
