import React, { useCallback, useState } from "react";
import { TextField } from "../TextField";
import { LensIcon } from "../../icons/LensIcon";
import { classes } from "./styles";
import { FlashcardFilterData } from "../../utilities/types";
import { FlashcardFilterSettings } from "./FlaschardFilterSettings";
import { SliderIcon } from "../../icons/SliderIcon";
import { IconButton } from "../IconButton";
import { ExIcon } from "../../icons/ExIcon";
import { ACTIVE_COLOR } from "../../utilities/styles";

export interface FilterHeaderProps {
  filter: FlashcardFilterData;
  onUpdate: (filter: FlashcardFilterData) => void;
}

export const FilterHeader: React.FC<FilterHeaderProps> = ({
  filter,
  onUpdate,
}) => {
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const onUpdateText = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate({
        ...filter,
        include: { ...filter.include, text: event.target.value },
      });
    },
    [filter, onUpdate]
  );

  const onOpenMoreOptions = useCallback(() => {
    setShowMoreOptions(true);
  }, []);

  const onCloseMoreOptions = useCallback(() => {
    setShowMoreOptions(false);
  }, []);

  const onClearSearchText = useCallback(() => {
    onUpdate({
      ...filter,
      include: { ...filter.include, text: "" },
    });
  }, [onUpdate, filter]);

  const hasNonDefaultSettings = () => {
    if (filter.include.tagIdList.length > 0) {
      return true;
    }
    return false;
  };

  return (
    <>
      <TextField
        placeholder="Filter cards by text"
        leftPadContent={<LensIcon size={22} />}
        onChange={onUpdateText}
        value={filter.include.text}
        rightPadContent={
          filter.include.text ? (
            <IconButton
              className={classes.clearTextButton}
              icon={<ExIcon size={16} />}
              onClick={onClearSearchText}
            />
          ) : null
        }
      />
      <IconButton
        className={classes.moreButton}
        icon={
          <SliderIcon
            size={22}
            fillColor={hasNonDefaultSettings() ? ACTIVE_COLOR : undefined}
          />
        }
        onClick={onOpenMoreOptions}
      />
      {showMoreOptions ? (
        <FlashcardFilterSettings
          onClose={onCloseMoreOptions}
          filter={filter}
          onUpdate={onUpdate}
        />
      ) : null}
    </>
  );
};
