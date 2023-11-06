import { useCallback, useMemo, useState } from "react";
import { BasePopupView } from "app/components/BasePopupView";
import { TagChip } from "app/components/TagChip";
import { classes } from "./styles";
import { useChangeTagListOnFlashcardList, useFlashcardTagMap } from "app/state";
import { Checkbox } from "../Checkbox";
import { Button } from "../Button";
import { FlashcardData, FlashcardTagData } from "practicard-shared";
import { FlashcardTagMenuHeader } from "../FlashcardTagMenuHeader";

export interface FlashcardTagSelectionMenuProps {
  onClose: () => void;
  /** The list of flashcards with tag lists been affected */
  flashcardList: FlashcardData[];
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
> = ({ onClose, flashcardList }) => {
  const [filterText, setFilterText] = useState("");
  const [checkedTagSet, setCheckedTagSet] = useState(new Set<number>());
  const [uncheckedTagSet, setUncheckedTagSet] = useState(new Set<number>());

  const tagMap = useFlashcardTagMap();
  const changeTagListOnFlashcardList = useChangeTagListOnFlashcardList();

  const augTagList: AugmentedTagData[] | undefined = useMemo(() => {
    return (
      tagMap &&
      Object.values(tagMap).map((tag) => {
        const checked = flashcardList.every(
          (card) => card.tagIdList.indexOf(tag.id) !== -1
        );
        return {
          ...tag,
          checked,
          indeterminate:
            !checked &&
            flashcardList.some((card) => card.tagIdList.indexOf(tag.id) !== -1),
          onChangeChecked: (event, checked) => {
            setCheckedTagSet((set) => {
              const newSet = new Set(set);
              if (checked) {
                newSet.add(tag.id);
              } else {
                newSet.delete(tag.id);
              }
              return newSet;
            });
            setUncheckedTagSet((set) => {
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

  const onApplyChanges = useCallback(() => {
    changeTagListOnFlashcardList(
      Array.from(checkedTagSet),
      Array.from(uncheckedTagSet),
      flashcardList.map((card) => card.id)
    );
    onClose();
  }, [
    changeTagListOnFlashcardList,
    checkedTagSet,
    uncheckedTagSet,
    flashcardList,
    onClose,
  ]);

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
                  !uncheckedTagSet.has(tag.id) &&
                  (tag.checked || checkedTagSet.has(tag.id))
                }
                indeterminate={
                  tag.indeterminate &&
                  !uncheckedTagSet.has(tag.id) &&
                  !checkedTagSet.has(tag.id)
                }
              />
            ))
            .reverse()}
      </div>
      <Button onClick={onApplyChanges}>Apply changes</Button>
    </BasePopupView>
  );
};
