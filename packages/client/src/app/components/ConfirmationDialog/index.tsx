import React, { useCallback } from "react";
import { BasePopupView } from "../BasePopupView";
import { Button } from "../Button";

export interface ConfirmationDialogProps {
  text: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  text,
  onConfirm,
  onClose,
}) => {
  const onAccept = useCallback(() => {
    onConfirm();
    onClose();
  }, [onConfirm, onClose]);

  return (
    <BasePopupView title="Please confirm" onClose={onClose}>
      <p>{text}</p>
      <div>
        <Button onClick={onAccept}>Confirm</Button>
        <Button onClick={onClose}>Cancel</Button>
      </div>
    </BasePopupView>
  );
};
