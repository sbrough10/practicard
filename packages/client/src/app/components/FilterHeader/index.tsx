import React, { useCallback, useState } from "react";
import { classes } from "./styles";
import { FlashcardFilterData } from "practicard-shared";
import { FlashcardFilterSettings } from "./FlashcardFilterSettings";
import { SliderIcon } from "../../icons/SliderIcon";
import { IconButton } from "../IconButton";
import { ACTIVE_COLOR } from "../../utilities/styles";
import { TextFilterField } from "../TextFilterField";

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
    (text: string) => {
      onUpdate({
        ...filter,
        include: { ...filter.include, text },
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

  const hasNonDefaultSettings = () => {
    if (filter.include.tagIdList.length > 0) {
      return true;
    }
    return false;
  };

  return (
    <>
      <div className={classes.textFilterWrapper}>
        <TextFilterField
          placeholder="Filter cards by text"
          onChange={onUpdateText}
          value={filter.include.text}
        />
      </div>
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
