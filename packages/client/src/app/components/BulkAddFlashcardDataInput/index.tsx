import React, { useCallback, useRef, useState } from "react";
import { classes } from "./styles";
import { useCreateFlashcardList } from "app/state";
import { BasePopupView } from "app/components/BasePopupView";
import { Button } from "app/components/Button";
import { FlashcardTagData } from "app/utilities/types";
import { TagChipList } from "../TagChipList";

export interface BulkAddFlashcardDataInputProps {
  onClose: () => void;
  initTagIdList: FlashcardTagData["id"][];
  onBulkAddComplete: () => void;
}

export const BulkAddFlashcardDataInput: React.FC<
  BulkAddFlashcardDataInputProps
> = ({ onClose, initTagIdList, onBulkAddComplete }) => {
  const [tagIdList, setTagIdList] = useState(initTagIdList);
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  const createFlashcardList = useCreateFlashcardList();

  const editTagList = useCallback((newTagIdList: FlashcardTagData["id"][]) => {
    setTagIdList(newTagIdList);
  }, []);

  const bulkAdd = useCallback(() => {
    const textInput = textInputRef.current;
    if (!textInput) {
      return;
    }
    createFlashcardList(
      textInput.value.split("\n").map((row) => {
        const cells = row.split("\t");
        return {
          frontText: cells[0] ?? "",
          backText: cells[1] ?? "",
          // hits: cells[2] !== undefined ? parseInt(cells[2]) : undefined,
          // misses: cells[3] !== undefined ? parseInt(cells[3]) : undefined,
          tagIdList,
        };
      })
    );
    onClose();
    onBulkAddComplete();
  }, [
    textInputRef,
    createFlashcardList,
    tagIdList,
    onClose,
    onBulkAddComplete,
  ]);

  return (
    <BasePopupView title="Add cards in bulk" onClose={onClose}>
      <div>
        Paste cards from a spreadsheet into the textfield below. The newly
        created cards will be assigned the following tags automatically:
      </div>
      <TagChipList tagIdList={tagIdList} onEditList={editTagList} />
      <div className={classes.inputSection}>
        <textarea className={classes.textInput} ref={textInputRef} />
      </div>
      <div className={classes.buttonSection}>
        <Button onClick={bulkAdd}>Add</Button>
        <Button onClick={onClose}>Cancel</Button>
      </div>
    </BasePopupView>
  );
};
