import React from "react";
import { MenuItem, Select } from "@mui/material";

type OptionValueFormat = string | number | readonly string[] | undefined;

export interface SelectDropdownOption<Value extends OptionValueFormat> {
  value: Value;
  label: string;
}

export interface SelectDropdownProps<OptionValue extends OptionValueFormat> {
  optionList: SelectDropdownOption<OptionValue>[];
}

export function SelectDropdown<OptionValue extends OptionValueFormat>({
  optionList,
}: SelectDropdownProps<OptionValue>) {
  return (
    <Select>
      {optionList.map((option) => (
        <MenuItem value={option.value}>{option.label}</MenuItem>
      ))}
    </Select>
  );
}
