import React, { useCallback, useMemo, useState } from "react";
import { FlashcardTagData } from "practicard-shared";
import { useFlashcardTagMap } from "app/state";
import { TagChip } from "app/components/TagChip";
import { classes } from "./styles";
import { IconButton } from "app/components/IconButton";
import { PlusIcon } from "app/icons/PlusIcon";
import clsx from "clsx";
import {
  FlashcardTagSelectionMenu,
  FlashcardTagSelectionMenuProps,
} from "app/components/FlashcardTagSelectionMenu";
import { PenIcon } from "app/icons/PenIcon";

export enum ChipAlignment {
  Left,
  Center,
}

const EMPTY_SET = new Set<FlashcardTagData["id"]>();

export interface TagChipListProps {
  tagIdList: FlashcardTagData["id"][];
  onEditList?: (tagIdList: FlashcardTagData["id"][]) => void;
  chipAlignment?: ChipAlignment;
}

export const TagChipList: React.FC<TagChipListProps> = ({
  tagIdList,
  onEditList,
  chipAlignment = ChipAlignment.Left,
}) => {
  const [showTagMenu, setShowTagMenu] = useState(false);

  const tagMap = useFlashcardTagMap();

  const openTagMenu = useCallback(() => setShowTagMenu(true), []);
  const closeTagMenu = useCallback(() => setShowTagMenu(false), []);

  const changeTaglist: FlashcardTagSelectionMenuProps["onApplyChanges"] =
    useCallback(
      (addedTagIdsList, removedTagIdList) => {
        const newTagIdList = [...tagIdList]
          .filter((tagId) => removedTagIdList.indexOf(tagId) === -1)
          .concat(addedTagIdsList);
        onEditList?.(newTagIdList);
      },
      [tagIdList, onEditList]
    );

  const checkedTagSet = useMemo(() => new Set(tagIdList), [tagIdList]);

  if (!tagMap) {
    return null;
  }

  return (
    <div className={classes.root}>
      {onEditList && (
        <>
          <IconButton
            onClick={openTagMenu}
            className={classes.addButton}
            icon={<PenIcon size={22} fillColor="black" />}
          ></IconButton>
          {showTagMenu && (
            <FlashcardTagSelectionMenu
              onApplyChanges={changeTaglist}
              onClose={closeTagMenu}
              checkedTagSet={checkedTagSet}
              indeterminateTagSet={EMPTY_SET}
            />
          )}
        </>
      )}
      <div
        className={clsx({
          [classes.chipList]: true,
          [classes.leftChipAligned]: chipAlignment === ChipAlignment.Left,
          [classes.centerChipAligned]: chipAlignment === ChipAlignment.Center,
        })}
      >
        {tagIdList.length > 0 ? (
          tagIdList.map((tagId) => (
            <TagChip id={tagId} label={tagMap[tagId].label} />
          ))
        ) : (
          <button onClick={openTagMenu} className={classes.noTags}>
            No tags
          </button>
        )}
      </div>
    </div>
  );
};
