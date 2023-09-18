import React, { useCallback, useRef, useState } from "react";
import { classes } from "./styles";
import { FlashcardTagData } from "practicard-shared";
import { useCreateFlashcardTag, useFlashcardTagMap } from "../../state";
import { TagChip } from "../TagChip";
import { BasePopupView } from "../BasePopupView";
import { TextField } from "../TextField";
import { IconButton } from "../IconButton";
import { CheckIcon } from "../../icons/CheckIcon";
import { ExIcon } from "../../icons/ExIcon";

export interface FlashcardTagMenuProps {
  onClose: () => void;
  onSelectTag: (tagId: FlashcardTagData["id"]) => void;
  isAdding: boolean;
}

export const FlashcardTagMenu: React.FC<FlashcardTagMenuProps> = ({
  onClose,
  onSelectTag,
  isAdding,
}) => {
  const tagMap = useFlashcardTagMap();
  const createTag = useCreateFlashcardTag();
  const [showNewTagInput, setShowNewTagInput] = useState(false);
  const createTagInputRef = useRef<HTMLInputElement>(null);
  const createTagInput = createTagInputRef.current;

  const onCreateTag = useCallback(() => {
    setShowNewTagInput(true);
  }, []);

  const onClickTag = useCallback(
    (id: FlashcardTagData["id"]) => {
      onSelectTag(id);
      onClose();
    },
    [onSelectTag, onClose]
  );

  const createNewTag = useCallback(() => {
    if (createTagInputRef.current) {
      createTag(createTagInputRef.current.value);
      setShowNewTagInput(false);
    }
  }, [createTagInput]);

  const cancelNewTagCreation = useCallback(() => {
    setShowNewTagInput(false);
  }, []);

  if (!tagMap) {
    return null;
  }

  const addingInput = showNewTagInput ? (
    <div className={classes.createTagSection}>
      <TextField ref={createTagInputRef} />
      <IconButton
        className={classes.button}
        icon={<CheckIcon size={22} fillColor="white" />}
        onClick={createNewTag}
      />
      <IconButton
        className={classes.button}
        icon={<ExIcon size={22} fillColor="white" />}
        onClick={cancelNewTagCreation}
      />
    </div>
  ) : (
    <button onClick={onCreateTag}>Create new tag</button>
  );

  return (
    <BasePopupView title="Select a tag" onClose={onClose}>
      <div className={classes.root}>
        {isAdding ? addingInput : null}
        {Object.values(tagMap)
          .map((tag) => (
            <TagChip onClick={onClickTag} id={tag.id} label={tag.label} />
          ))
          .reverse()}
      </div>
    </BasePopupView>
  );
};
