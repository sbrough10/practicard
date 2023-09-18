import { useCallback } from "react";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";

type OptionValueFormat = string | number | readonly string[] | undefined;

export interface SelectDropdownOption<Value extends OptionValueFormat> {
  value: Value;
  label: string;
}

export interface SelectDropdownProps<OptionValue extends OptionValueFormat> {
  optionList: SelectDropdownOption<OptionValue>[];
  onSelect?: (value: OptionValue) => void;
  selected?: OptionValue;
}

export function SelectDropdown<OptionValue extends OptionValueFormat>({
  optionList,
  onSelect,
  selected,
}: SelectDropdownProps<OptionValue>) {
  const onChange = useCallback(
    (event: SelectChangeEvent<OptionValue>) => {
      onSelect?.(event.target.value as OptionValue);
    },
    [onSelect]
  );

  return (
    <Select onChange={onChange} value={selected}>
      {optionList.map((option) => (
        <MenuItem value={option.value}>{option.label}</MenuItem>
      ))}
    </Select>
  );
}
