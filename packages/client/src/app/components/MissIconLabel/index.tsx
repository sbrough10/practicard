import React from "react";
import { classes } from "./styles";
import { ExIcon } from "../../icons/ExIcon";
import { MISS_ICON_COLOR } from "../../utilities/styles";

export interface MissIconLabelProps {
  size?: number;
}

export const MissIconLabel: React.FC<MissIconLabelProps> = ({ size = 32 }) => {
  return (
    <div
      className={classes.root}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <ExIcon size={size - 6} fillColor={MISS_ICON_COLOR} />
    </div>
  );
};
