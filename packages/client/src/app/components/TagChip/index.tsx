import React, { useCallback } from "react";
import { FlashcardTagData } from "../../utilities/types";
import { classes } from "./styles";
import Color from "color";
import { IconButton } from "../IconButton";
import { ExIcon } from "../../icons/ExIcon";

const TAG_COLOR_OPTIONS = [
  "cc0000",
  "00cc00",
  "0000cc",
  "cccc00",
  "00cccc",
  "cc00cc",
  "cc6600",
  "00cc66",
  "6600cc",
  "66cc00",
  "0066cc",
  "cc0066",
];

export interface TagChipProps extends FlashcardTagData {
  onClick?: (id: FlashcardTagData["id"]) => void;
  canEdit?: boolean;
  onRemove?: (id: FlashcardTagData["id"]) => void;
}

export const TagChip: React.FC<TagChipProps> = ({
  id,
  label,
  onClick,
  canEdit,
  onRemove,
}) => {
  const borderColor = `#${TAG_COLOR_OPTIONS[id % TAG_COLOR_OPTIONS.length]}`;

  const onChipClick = useCallback(() => {
    onClick?.(id);
  }, [onClick, id]);

  const onClickEx = useCallback(() => {
    onRemove?.(id);
  }, [onRemove, id]);

  return (
    <button
      disabled={!onClick}
      className={classes.root}
      onClick={onChipClick}
      style={{
        borderColor,
        backgroundColor: Color(borderColor)
          .lighten(0.5)
          .desaturate(0.75)
          .toString(),
      }}
    >
      {label}
      {onRemove ? (
        <IconButton
          className={classes.button}
          icon={<ExIcon size={12} fillColor="black" />}
          onClick={onClickEx}
        />
      ) : null}
    </button>
  );
};
