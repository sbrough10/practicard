import { TextField } from "app/components/TextField";
import { LensIcon } from "app/icons/LensIcon";
import { IconButton } from "app/components/IconButton";
import { ExIcon } from "app/icons/ExIcon";
import { classes } from "./styles";
import { useCallback } from "react";

export interface TextFilterFieldProps {
  placeholder: string;
  onChange: (text: string) => void;
  value: string;
}

export const TextFilterField: React.FC<TextFilterFieldProps> = ({
  placeholder,
  onChange,
  value,
}) => {
  const onChangeText: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      onChange(event.target.value);
    },
    [onChange]
  );

  const onClearText = useCallback(() => {
    onChange("");
  }, [onChange]);

  return (
    <TextField
      placeholder={placeholder}
      leftPadContent={<LensIcon size={22} />}
      onChange={onChangeText}
      value={value}
      rightPadContent={
        value ? (
          <IconButton
            className={classes.clearTextButton}
            icon={<ExIcon size={16} />}
            onClick={onClearText}
          />
        ) : null
      }
    />
  );
};
