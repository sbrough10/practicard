import React from "react";
import {
  FormControlLabel,
  Checkbox as MuiCheckbox,
  CheckboxProps as MuiCheckboxProps,
} from "@mui/material";

export interface CheckboxProps extends MuiCheckboxProps {
  label?: React.ReactNode;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, ...props }) => {
  if (label) {
    return (
      <FormControlLabel control={<MuiCheckbox {...props} />} label={label} />
    );
  }
  return <MuiCheckbox {...props} />;
};
