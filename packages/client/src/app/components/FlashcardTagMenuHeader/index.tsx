import { useCallback, useRef, useState } from "react";
import { Button } from "app/components/Button";
import { TextFilterField } from "app/components/TextFilterField";
import { TextField } from "app/components/TextField";
import { IconButton } from "../IconButton";
import { CheckIcon } from "app/icons/CheckIcon";
import { classes } from "./styles";
import { useCreateFlashcardTag } from "app/state";
import { BackIcon } from "app/icons/BackIcon";

enum DisplayOption {
  None,
  Search,
  Create,
}

export interface FlashcardTagMenuHeaderProps {
  onChangeSearchText: (text: string) => void;
}

export const FlashcardTagMenuHeader: React.FC<FlashcardTagMenuHeaderProps> = ({
  onChangeSearchText,
}) => {
  const [showOption, setShowOption] = useState(DisplayOption.None);
  const [filterText, setFilterText] = useState("");

  const createTag = useCreateFlashcardTag();

  const createTagInputRef = useRef<HTMLInputElement>(null);

  const setDisplaySearch = useCallback(
    () => setShowOption(DisplayOption.Search),
    []
  );

  const setDisplayCreate = useCallback(
    () => setShowOption(DisplayOption.Create),
    []
  );

  const changeTextFilter = useCallback(
    (text: string) => {
      setFilterText(text);
      onChangeSearchText(text);
    },
    [onChangeSearchText]
  );

  const clearDisplayOption = useCallback(() => {
    setShowOption(DisplayOption.None);
    changeTextFilter("");
  }, [changeTextFilter]);

  const createNewTag = useCallback(() => {
    if (createTagInputRef.current) {
      createTag(createTagInputRef.current.value);
      clearDisplayOption();
    }
  }, [createTagInputRef, createTag, clearDisplayOption]);

  const getElements = () => {
    switch (showOption) {
      case DisplayOption.Search:
        return (
          <>
            <IconButton
              className={classes.squareButton}
              icon={<BackIcon size={22} fillColor="white" />}
              onClick={clearDisplayOption}
            />
            <div className={classes.textFieldWrapper}>
              <TextFilterField
                placeholder="Filter tags"
                onChange={changeTextFilter}
                value={filterText}
              />
            </div>
          </>
        );
      case DisplayOption.Create:
        return (
          <>
            <IconButton
              className={classes.squareButton}
              icon={<BackIcon size={22} fillColor="white" />}
              onClick={clearDisplayOption}
            />
            <div className={classes.textFieldWrapper}>
              <TextField ref={createTagInputRef} />
            </div>
            <IconButton
              className={classes.squareButton}
              icon={<CheckIcon size={22} fillColor="white" />}
              onClick={createNewTag}
            />
          </>
        );

      default:
        return (
          <>
            <Button className={classes.optionButton} onClick={setDisplaySearch}>
              Search
            </Button>
            <Button className={classes.optionButton} onClick={setDisplayCreate}>
              Create
            </Button>
          </>
        );
    }
  };

  return <div className={classes.root}>{getElements()}</div>;
};
