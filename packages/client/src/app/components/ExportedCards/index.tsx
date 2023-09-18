import React, { useCallback, useRef } from "react";
import { BasePopupView } from "../BasePopupView";
import { useFlashcardBatch, useFlashcardTagMap } from "app/state";
import { FlashcardFilterData } from "practicard-shared";
import { Button } from "@mui/material";
import { classes } from "./styles";

export interface ExportedCardsProps {
  onClose: () => void;
  filter: FlashcardFilterData;
}

export const ExportedCards: React.FC<ExportedCardsProps> = ({
  onClose,
  filter,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { list: flashcardList } = useFlashcardBatch({ filter }) ?? {};
  const flashcardTagMap = useFlashcardTagMap();

  const text =
    (flashcardTagMap &&
      flashcardList
        ?.map(
          ({ frontText, backText, hits, misses, tagIdList }) =>
            `${frontText}\t${backText}\t${hits}\t${misses}\t${tagIdList
              .map((tagId) => flashcardTagMap[tagId].label)
              .join("\t")}`
        )
        .join("\n")) ??
    "";

  const copyToClipboard = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);
      navigator.clipboard
        .writeText(textarea.value)
        .then(() => {
          alert("copy success");
        })
        .catch(() => {
          alert("copy failure");
        });
    }
  }, [text]);

  return (
    <BasePopupView title="Exported card data" onClose={onClose}>
      <Button onClick={copyToClipboard}>Copy to clipboard</Button>
      <textarea disabled={true} className={classes.text} ref={textareaRef}>
        {text}
      </textarea>
    </BasePopupView>
  );
};
