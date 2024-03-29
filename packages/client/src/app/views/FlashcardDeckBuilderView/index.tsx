import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useChangeTagListOnFlashcardList,
  useCreateFlashcard,
  useCreateFlashcardDeck,
  useDeleteFlashcardList,
  useEndSession,
  useFlashcardBatch,
  useFlashcardTagMap,
} from "app/state";
import { FlashcardDataRow } from "app/components/FlashcardDataRow";
import { classes } from "./styles";
import { FlashcardFilterData } from "practicard-shared";
import { BulkAddFlashcardDataInput } from "app/components/BulkAddFlashcardDataInput";
import { ConfirmationDialog } from "app/components/ConfirmationDialog";
import { Button } from "app/components/Button";
import { IconButton } from "app/components/IconButton";
import { PlayIcon } from "app/icons/PlayIcon";
import { PlusIcon } from "app/icons/PlusIcon";
import { HitIconLabel } from "app/components/HitIconLabel";
import { MissIconLabel } from "app/components/MissIconLabel";
import { FilterHeader } from "app/components/FilterHeader";
import { Checkbox } from "app/components/Checkbox";
import { ExportIcon } from "app/icons/ExportIcon";
import { ExportedCards } from "app/components/ExportedCards";
import { LoadingIndicator } from "app/components/LoadingIndicator";
import { MenuIcon } from "app/icons/MenuIcon";
import {
  FlashcardTagSelectionMenu,
  FlashcardTagSelectionMenuProps,
} from "app/components/FlashcardTagSelectionMenu";
import { Menu } from "app/components/Menu";
import { MenuItem } from "app/components/MenuItems";
import { getTagSelectionStatus } from "app/components/FlashcardTagSelectionMenu/utils";

export enum DisplayedDialog {
  None,
  ChangeTagMenu,
  BulkAddFlashcard,
  ExportFlashcardList,
  DeleteFlashcardConfirmationDialog,
  Settings,
}

export interface FlashcardDeckBuilderViewProps {
  filter: FlashcardFilterData;
  onChangeFilter: (filter: FlashcardFilterData) => void;
  onStartPractice: () => void;
}

export const FlashcardDeckBuilderView: React.FC<
  FlashcardDeckBuilderViewProps
> = ({ filter, onChangeFilter, onStartPractice: startPractice }) => {
  const [selectedCardList, setSelectedCardList] = useState<Set<number>>(
    new Set()
  );
  const [showDialog, setShowDialog] = useState(DisplayedDialog.None);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const cardListContainerRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLElement | null>(null);
  const {
    list: flashcardList,
    isLoading,
    isValid,
  } = useFlashcardBatch({ filter }) ?? {};

  const tagSelectionStatus = useMemo(
    () =>
      getTagSelectionStatus(
        flashcardList?.filter((card) => selectedCardList.has(card.id)) ?? []
      ),
    [flashcardList, selectedCardList]
  );

  useEffect(() => {
    if (!flashcardList) {
      return;
    }
    const revisedList = Array.from(selectedCardList).filter(
      (cardId) => flashcardList.findIndex((card) => cardId === card.id) > -1
    );
    if (revisedList.length < selectedCardList.size) {
      setSelectedCardList(new Set(revisedList));
    }
  }, [flashcardList]);

  const createFlashcardDeck = useCreateFlashcardDeck();
  const createFlashcard = useCreateFlashcard();
  const endSession = useEndSession();
  const changeTagListOnFlashcardList = useChangeTagListOnFlashcardList();
  const deleteFlashcardList = useDeleteFlashcardList();

  const onCardListExpanded = useCallback(() => {
    const cardListContainer = cardListContainerRef.current;
    if (cardListContainer) {
      cardListContainer.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [cardListContainerRef]);

  const onChangeSelected = useCallback((id: number, isSelected: boolean) => {
    setSelectedCardList((set) => {
      if (isSelected) {
        set.add(id);
      } else {
        set.delete(id);
      }
      return new Set(set);
    });
  }, []);

  const onStartPractice = useCallback(() => {
    createFlashcardDeck(filter);
    startPractice();
  }, [createFlashcardDeck, filter, startPractice]);

  const onClickMenuButton: React.MouseEventHandler<HTMLButtonElement> =
    useCallback(
      (event) => {
        menuButtonRef.current = event.currentTarget;
        setShowOptionsMenu(true);
      },
      [menuButtonRef]
    );

  const onCloseOptionMenu = useCallback(() => setShowOptionsMenu(false), []);

  const onAddFlashcard = useCallback(() => {
    createFlashcard({ tagIdList: filter.include.tagIdList });
    onCardListExpanded();
  }, [createFlashcard, filter, onCardListExpanded]);

  const onBulkAddFlashcard = useCallback(() => {
    setShowDialog(DisplayedDialog.BulkAddFlashcard);
  }, []);

  const onExportFlashcardList = useCallback(() => {
    setShowDialog(DisplayedDialog.ExportFlashcardList);
  }, []);

  const onSignOut = useCallback(() => {
    endSession();
  }, [endSession]);

  const allCardsSelected = selectedCardList.size === flashcardList?.length;

  const changeUniversalSelection = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (allCardsSelected) {
        setSelectedCardList(new Set());
      } else {
        setSelectedCardList(
          new Set(flashcardList?.map((flashcard) => flashcard.id) ?? [])
        );
      }
    },
    [allCardsSelected, flashcardList]
  );

  const onChangeTags = useCallback(() => {
    setShowDialog(DisplayedDialog.ChangeTagMenu);
  }, []);

  const onDeleteFlashcardList = useCallback(() => {
    setShowDialog(DisplayedDialog.DeleteFlashcardConfirmationDialog);
  }, []);

  const closeDialog = useCallback(() => {
    setShowDialog(DisplayedDialog.None);
  }, []);

  const onUpdateFilter = useCallback(
    (filter: FlashcardFilterData) => {
      onChangeFilter(filter);
    },
    [onChangeFilter]
  );

  const applyTagChangesToSelection = useCallback<
    FlashcardTagSelectionMenuProps["onApplyChanges"]
  >(
    (addedTagIdsList, removedTagIdList) => {
      changeTagListOnFlashcardList(
        addedTagIdsList,
        removedTagIdList,
        Array.from(selectedCardList)
      );
    },
    [changeTagListOnFlashcardList, selectedCardList]
  );

  const deleteSelectedFlashcardList = useCallback(() => {
    deleteFlashcardList(Array.from(selectedCardList));
  }, [selectedCardList, deleteFlashcardList]);

  const getCardList = () => {
    if (!flashcardList || isLoading || !isValid) {
      return (
        <div className={classes.emptyCardList}>
          <LoadingIndicator />
        </div>
      );
    }
    if (flashcardList.length > 0) {
      return flashcardList
        .map((flashcard) => (
          <FlashcardDataRow
            key={flashcard.id}
            data={flashcard}
            selected={selectedCardList.has(flashcard.id)}
            onChangeSelect={onChangeSelected}
          />
        ))
        .reverse();
    }
    return (
      <div className={classes.emptyCardList}>
        No flashcards to display. Add some
      </div>
    );
  };

  const getDisplayedDialog = () => {
    switch (showDialog) {
      case DisplayedDialog.BulkAddFlashcard:
        return (
          <BulkAddFlashcardDataInput
            onClose={closeDialog}
            initTagIdList={filter.include.tagIdList}
            onBulkAddComplete={onCardListExpanded}
          />
        );
      case DisplayedDialog.ExportFlashcardList:
        return <ExportedCards onClose={closeDialog} filter={filter} />;
      case DisplayedDialog.ChangeTagMenu:
        return (
          <FlashcardTagSelectionMenu
            onApplyChanges={applyTagChangesToSelection}
            onClose={closeDialog}
            {...tagSelectionStatus}
          />
        );
      case DisplayedDialog.DeleteFlashcardConfirmationDialog:
        return (
          <ConfirmationDialog
            text={`Are you sure you want to delete all selected flashcards (${selectedCardList.size})?`}
            onClose={closeDialog}
            onConfirm={deleteSelectedFlashcardList}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <IconButton
          icon={<PlayIcon />}
          onClick={onStartPractice}
          disabled={!flashcardList || flashcardList.length === 0}
        >
          Start
        </IconButton>
        <IconButton icon={<MenuIcon />} onClick={onClickMenuButton}>
          More
        </IconButton>
        <Menu
          open={showOptionsMenu}
          onClose={onCloseOptionMenu}
          anchorEl={menuButtonRef.current}
        >
          <MenuItem onClick={onAddFlashcard}>
            <PlusIcon />
            Add card
          </MenuItem>
          <MenuItem onClick={onBulkAddFlashcard}>
            <PlusIcon />
            Bulk add
          </MenuItem>
          <MenuItem onClick={onExportFlashcardList}>
            <ExportIcon />
            Export
          </MenuItem>
          <MenuItem onClick={onSignOut}>
            <ExportIcon />
            Sign out
          </MenuItem>
        </Menu>
      </div>
      <div className={classes.filterHeaderWrapper}>
        {flashcardList && flashcardList.length > 0 ? (
          <Checkbox
            className={classes.filterHeaderCheckbox}
            checked={allCardsSelected}
            indeterminate={selectedCardList.size > 0 && !allCardsSelected}
            onChange={changeUniversalSelection}
          />
        ) : null}
        <FilterHeader filter={filter} onUpdate={onUpdateFilter} />
      </div>
      {flashcardList && flashcardList.length > 0 ? (
        <div className={classes.tableHeader}>
          <div className={classes.checkboxColumnSpace}>
            <Checkbox
              checked={allCardsSelected}
              indeterminate={selectedCardList.size > 0 && !allCardsSelected}
              onChange={changeUniversalSelection}
            />
          </div>
          <div className={classes.cardTextColumnHeader}>Front</div>
          <div className={classes.cardTextColumnHeader}>Back</div>
          <div className={classes.hitMissColumnHeader}>
            <HitIconLabel size={22} />
          </div>
          <div className={classes.hitMissColumnHeader}>
            <MissIconLabel size={22} />
          </div>
          <div className={classes.hitMissColumnHeader}>
            <HitIconLabel size={22} />%
          </div>
        </div>
      ) : null}
      <div className={classes.body} ref={cardListContainerRef}>
        {getCardList()}
      </div>
      {selectedCardList.size > 0 ? (
        <>
          <div className={classes.footer}>
            <div>Selected ({selectedCardList.size})</div>
            <Button onClick={onChangeTags}>Change tags</Button>
            <Button onClick={onDeleteFlashcardList}>Delete</Button>
          </div>
        </>
      ) : null}
      {getDisplayedDialog()}
    </div>
  );
};
