import React, { useCallback } from "react";
import { produce } from "immer";
import {
  BasePopupView,
  BasePopupViewProps,
} from "app/components/BasePopupView";
import { TagChipList } from "app/components/TagChipList";
import { Checkbox } from "app/components/Checkbox";
import { FlashcardFilterData, FlashcardTagData } from "practicard-shared";
import { MaxHitPercentageInput } from "./MaxHitPercentageInput";
import { classes } from "./styles";

export interface FlashcardFilterSettingsProps {
  filter: FlashcardFilterData;
  onUpdate: (filter: FlashcardFilterData) => void;
  onClose: BasePopupViewProps["onClose"];
}

export const FlashcardFilterSettings: React.FC<
  FlashcardFilterSettingsProps
> = ({ filter, onUpdate, onClose }) => {
  const toggleOnlyInlcudeCardsWithNoTag = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate(
        produce(filter, (draft) => {
          draft.include.onlyNoTag = event.target.checked;
        })
      );
    },
    [onUpdate, filter]
  );

  const toggleIncludeCardsWithNoTag = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate(
        produce(filter, (draft) => {
          draft.include.noTag = event.target.checked;
        })
      );
    },
    [onUpdate, filter]
  );

  const editIncludeTagList = useCallback(
    (tagIdList: FlashcardTagData["id"][]) => {
      onUpdate(
        produce(filter, (draft) => {
          draft.include.tagIdList = tagIdList;
        })
      );
    },
    [onUpdate]
  );

  return (
    <BasePopupView title="Advanced filter settings" onClose={onClose}>
      <div className={classes.root}>
        <div className={classes.label}>Include</div>
        <div className={classes.inputRow}>
          <Checkbox
            label="Only show card with no tags"
            onChange={toggleOnlyInlcudeCardsWithNoTag}
            checked={filter.include.onlyNoTag}
          />
        </div>
        {!filter.include.onlyNoTag ? (
          <>
            <div className={classes.inputRow}>
              <TagChipList
                tagIdList={filter.include.tagIdList ?? []}
                onEditList={editIncludeTagList}
              />
            </div>
            <div className={classes.inputRow}>
              <Checkbox
                label="Show cards with no tags"
                onChange={toggleIncludeCardsWithNoTag}
                checked={
                  filter.include.noTag || filter.include.tagIdList.length === 0
                }
                disabled={filter.include.tagIdList.length === 0}
              />
            </div>
          </>
        ) : null}
        <div className={classes.inputRow}>
          <MaxHitPercentageInput onUpdate={onUpdate} filter={filter} />
        </div>
      </div>
    </BasePopupView>
  );
};
