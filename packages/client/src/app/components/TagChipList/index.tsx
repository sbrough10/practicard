import React, { useCallback, useState } from "react";
import { FlashcardTagData } from "practicard-shared";
import { useFlashcardTagMap } from "app/state";
import { TagChip } from "app/components/TagChip";
import { classes } from "./styles";
import { IconButton } from "app/components/IconButton";
import { FlashcardTagMenu } from "app/components/FlashcardTagMenu";
import { PlusIcon } from "app/icons/PlusIcon";
import clsx from "clsx";

export enum ChipAlignment {
  Left,
  Center,
}

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

  const addTag = useCallback(
    (tagId: FlashcardTagData["id"]) => {
      onEditList?.([...tagIdList, tagId]);
    },
    [onEditList, tagIdList]
  );

  const removeTag = useCallback(
    (tagId: FlashcardTagData["id"]) => {
      const newTagIdList = [...tagIdList];
      const index = newTagIdList.indexOf(tagId);
      newTagIdList.splice(index, 1);
      onEditList?.(newTagIdList);
    },
    [tagIdList, onEditList]
  );

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
            icon={<PlusIcon size={22} fillColor="black" />}
          ></IconButton>
          {showTagMenu && (
            <FlashcardTagMenu
              isAdding={true}
              onSelectTag={addTag}
              onClose={closeTagMenu}
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
            <TagChip
              id={tagId}
              label={tagMap[tagId].label}
              onRemove={onEditList && removeTag}
            />
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
