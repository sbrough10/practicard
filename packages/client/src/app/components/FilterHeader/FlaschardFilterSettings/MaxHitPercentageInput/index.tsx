import { Slider } from "@mui/material";
import { HitIconLabel } from "app/components/HitIconLabel";
import { TextField } from "app/components/TextField";
import { FlashcardFilterData } from "app/utilities/types";
import { produce } from "immer";
import React, { useEffect, useState } from "react";
import { classes } from "./styles";

export interface MaxHitPercentageInputProps {
  filter: FlashcardFilterData;
  onUpdate: (filter: FlashcardFilterData) => void;
}

export const MaxHitPercentageInput: React.FC<MaxHitPercentageInputProps> = ({
  filter,
  onUpdate,
}) => {
  const { maxHitPercentage } = filter.include;

  const [sliderValue, setSliderValue] = useState(maxHitPercentage * 100);
  const [textValue, setTextValue] = useState(`${maxHitPercentage * 100}`);

  useEffect(() => {
    setTextValue(`${sliderValue}`);
  }, [sliderValue]);

  useEffect(() => {
    setSliderValue(maxHitPercentage * 100);
  }, [maxHitPercentage]);

  return (
    <div className={classes.root}>
      <div className={classes.label}>
        Max&nbsp;
        <HitIconLabel size={16} />
        %:
      </div>
      <TextField
        className={classes.textField}
        type="number"
        max={100}
        min={0}
        step={1}
        value={textValue}
        onChange={(ev) => {
          setTextValue(ev.target.value);
        }}
        onBlur={() => {
          onUpdate(
            produce(filter, (draft) => {
              draft.include.maxHitPercentage = parseInt(textValue) / 100;
            })
          );
        }}
      />
      <div className={classes.sliderWrapper}>
        <Slider
          min={0}
          max={100}
          step={1}
          size="small"
          value={sliderValue}
          onChange={(ev, value) => setSliderValue(value as number)}
          onChangeCommitted={(ev, value) =>
            onUpdate(
              produce(filter, (draft) => {
                draft.include.maxHitPercentage = (value as number) / 100;
              })
            )
          }
        />
      </div>
    </div>
  );
};
