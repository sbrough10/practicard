import React from "react";
import { CheckIcon } from "../../icons/CheckIcon";
import { classes } from "./styles";
import { HIT_ICON_COLOR } from "../../utilities/styles";

export interface HitIconLabelProps {
  size?: number;
}

export const HitIconLabel: React.FC<HitIconLabelProps> = ({ size = 32 }) => {
  return (
    <div
      className={classes.root}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <CheckIcon size={size - 6} fillColor={HIT_ICON_COLOR} />
    </div>
  );
};
