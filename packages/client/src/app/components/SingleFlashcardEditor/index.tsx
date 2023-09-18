import React from "react";
import { BasePopupView } from "../BasePopupView";
import { FlashcardDataRow } from "../FlashcardDataRow";
import { FlashcardData } from "practicard-shared";

export interface SingleFlashcardEditorProps {
  data: FlashcardData;
  onClose: () => void;
}

export const SingleFlashcardEditor: React.FC<SingleFlashcardEditorProps> = ({
  onClose,
  data,
}) => {
  return (
    <BasePopupView onClose={onClose} title="Edit flashcard">
      <FlashcardDataRow data={data} />
    </BasePopupView>
  );
};
