import React, { useCallback, useState } from "react";
import { classes } from "./styles";
import { FlashcardTagData } from "practicard-shared";
import { useFlashcardTagMap } from "../../state";
import { TagChip } from "app/components/TagChip";
import { BasePopupView } from "app/components/BasePopupView";
import { FlashcardTagMenuHeader } from "app/components/FlashcardTagMenuHeader";

export interface FlashcardTagMenuProps {
  onClose: () => void;
  onSelectTag: (tagId: FlashcardTagData["id"]) => void;
}

export const FlashcardTagMenu: React.FC<FlashcardTagMenuProps> = ({
  onClose,
  onSelectTag,
}) => {
  const tagMap = useFlashcardTagMap();
  const [filterText, setFilterText] = useState("");

  const onChangeSearchText = useCallback((text: string) => {
    setFilterText(text);
  }, []);

  const onClickTag = useCallback(
    (id: FlashcardTagData["id"]) => {
      onSelectTag(id);
      onClose();
    },
    [onSelectTag, onClose]
  );

  if (!tagMap) {
    return null;
  }

  return (
    <BasePopupView title="Select a tag" onClose={onClose}>
      <div>
        <FlashcardTagMenuHeader onChangeSearchText={onChangeSearchText} />
      </div>
      <div className={classes.tagList}>
        {Object.values(tagMap)
          .filter(
            (tag) =>
              tag.label.toLowerCase().indexOf(filterText.toLowerCase()) !== -1
          )
          .map((tag) => (
            <TagChip onClick={onClickTag} id={tag.id} label={tag.label} />
          ))
          .reverse()}
      </div>
    </BasePopupView>
  );
};
