import React, { useCallback, useRef, useState } from "react";
import { classes } from "./styles";
import {
  useCreateFlashcardListWithNewTagMap,
  useFlashcardTagMap,
} from "app/state";
import { BasePopupView } from "app/components/BasePopupView";
import { Button } from "app/components/Button";
import { FlashcardCreationData, FlashcardTagData } from "practicard-shared";
import { TagChipList } from "../TagChipList";

function getNum(value: string | undefined, backup: number) {
  if (value === undefined) {
    return backup;
  }

  const parsedNumber = parseInt(value);

  if (isNaN(parsedNumber)) {
    return backup;
  }

  return parsedNumber;
}
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

  const createFlashcardListWithNewTagMap =
    useCreateFlashcardListWithNewTagMap();
  const tagMap = useFlashcardTagMap();

  const editTagList = useCallback((newTagIdList: FlashcardTagData["id"][]) => {
    setTagIdList(newTagIdList);
  }, []);

  const bulkAdd = useCallback(() => {
    const textInput = textInputRef.current;
    if (!textInput) {
      return;
    }

    const newTagMap: { [tagLabel: string]: FlashcardCreationData[] } = {};
    const newCardList: FlashcardCreationData[] = [];
    textInput.value.split("\n").forEach((row) => {
      const cells = row.split("\t");

      const newCard = {
        frontText: cells[0] ?? "",
        backText: cells[1] ?? "",
        hits: getNum(cells[2], 0),
        misses: getNum(cells[3], 1),
        tagIdList: tagIdList ?? [],
      };

      newCardList.push(newCard);

      if (cells.length > 4) {
        for (let i = 4; i < cells.length; i++) {
          const tagLabel = cells[i];
          if (tagLabel) {
            const existingTag =
              tagMap &&
              Object.values(tagMap).find((tag) => tag.label === tagLabel);
            if (existingTag) {
              newCard.tagIdList = [...newCard.tagIdList, existingTag.id];
            } else {
              const cardWithTagList = newTagMap[tagLabel];
              if (!cardWithTagList) {
                newTagMap[tagLabel] = [newCard];
              } else {
                cardWithTagList.push(newCard);
              }
            }
          }
        }
      }
    });

    createFlashcardListWithNewTagMap(newTagMap, newCardList);
    onClose();
    onBulkAddComplete();
  }, [
    textInputRef,
    tagIdList,
    tagMap,
    createFlashcardListWithNewTagMap,
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
