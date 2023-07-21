import React, { useCallback, useRef } from "react";
import { BasePopupView } from "../BasePopupView";
import { useFlaschardList } from "app/state";
import { FlashcardFilterData } from "app/utilities/types";
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

  const flashcardList = useFlaschardList({ filter });

  const text =
    flashcardList
      ?.map((card) => card.frontText + "\t" + card.backText)
      .join("\n") ?? "";

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
      {/* <pre className={classes.text}>{text}</pre> */}
    </BasePopupView>
  );
};
