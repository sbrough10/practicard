import React from "react";
import { BasePopupView } from "../BasePopupView";
import { FlashcardDataRow } from "../FlashcardDataRow";
import { FlashcardData } from "app/utilities/types";

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
