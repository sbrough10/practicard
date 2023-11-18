import { useCallback, useMemo, useState } from "react";
import { BasePopupView } from "app/components/BasePopupView";
import { TagChip } from "app/components/TagChip";
import { classes } from "./styles";
import { useFlashcardTagMap } from "app/state";
import { Checkbox } from "../Checkbox";
import { Button } from "../Button";
import { FlashcardTagData } from "practicard-shared";
import { FlashcardTagMenuHeader } from "../FlashcardTagMenuHeader";
import { FlashcardTagListSelectionStatus } from "./utils";

export interface FlashcardTagSelectionMenuProps
  extends FlashcardTagListSelectionStatus {
  onApplyChanges: (
    addedTagIdsList: FlashcardTagData["id"][],
    removedTagIdList: FlashcardTagData["id"][]
  ) => void;
  onClose: () => void;
}

interface AugmentedTagData extends FlashcardTagData {
  checked: boolean;
  indeterminate: boolean;
  onChangeChecked: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void;
}

export const FlashcardTagSelectionMenu: React.FC<
  FlashcardTagSelectionMenuProps
> = ({
  onApplyChanges,
  onClose,
  checkedTagSet,
  indeterminateTagSet = new Set(),
}) => {
  const [filterText, setFilterText] = useState("");
  const [newlyCheckedTagSet, setNewlyCheckedTagSet] = useState(
    new Set<number>()
  );
  const [newlyUncheckedTagSet, setNewlyUncheckedTagSet] = useState(
    new Set<number>()
  );

  const tagMap = useFlashcardTagMap();

  const augTagList: AugmentedTagData[] | undefined = useMemo(() => {
    return (
      tagMap &&
      Object.values(tagMap).map((tag) => {
        return {
          ...tag,
          checked: checkedTagSet.has(tag.id),
          indeterminate: indeterminateTagSet.has(tag.id),
          onChangeChecked: (event, checked) => {
            setNewlyCheckedTagSet((set) => {
              const newSet = new Set(set);
              if (checked) {
                newSet.add(tag.id);
              } else {
                newSet.delete(tag.id);
              }
              return newSet;
            });
            setNewlyUncheckedTagSet((set) => {
              const newSet = new Set(set);
              if (checked) {
                newSet.delete(tag.id);
              } else {
                newSet.add(tag.id);
              }
              return newSet;
            });
          },
        };
      })
    );
  }, [tagMap]);

  const onChangeTextFilter = useCallback((text: string) => {
    setFilterText(text);
  }, []);

  const applyChanges = useCallback(() => {
    onApplyChanges(
      Array.from(newlyCheckedTagSet),
      Array.from(newlyUncheckedTagSet)
    );
    onClose();
  }, [newlyCheckedTagSet, newlyUncheckedTagSet, onApplyChanges, onClose]);

  return (
    <BasePopupView title="Change tag selection" onClose={onClose}>
      <FlashcardTagMenuHeader onChangeSearchText={onChangeTextFilter} />
      <div className={classes.tagList}>
        {augTagList &&
          augTagList
            .filter(
              (tag) =>
                tag.label.toLowerCase().indexOf(filterText.toLowerCase()) !== -1
            )
            .map((tag) => (
              <Checkbox
                label={<TagChip {...tag} />}
                onChange={tag.onChangeChecked}
                checked={
                  !newlyUncheckedTagSet.has(tag.id) &&
                  (tag.checked || newlyCheckedTagSet.has(tag.id))
                }
                indeterminate={
                  tag.indeterminate &&
                  !newlyUncheckedTagSet.has(tag.id) &&
                  !newlyCheckedTagSet.has(tag.id)
                }
              />
            ))
            .reverse()}
      </div>
      <Button onClick={applyChanges}>Apply changes</Button>
    </BasePopupView>
  );
};
