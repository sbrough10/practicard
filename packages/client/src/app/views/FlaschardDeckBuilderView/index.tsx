import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  useAddTagToFlashcardList,
  useCreateFlaschard,
  useCreateFlashcardDeck,
  useDeleteFlashcardList,
  useFlaschardList,
  useRemoveTagFromFlashcardList,
} from "../../state";
import { FlashcardDataRow } from "../../components/FlashcardDataRow";
import { classes } from "./styles";
import { FlashcardTagMenu } from "../../components/FlashcardTagMenu";
import { FlashcardFilterData, FlashcardTagData } from "../../utilities/types";
import { BulkAddFlashcardDataInput } from "../../components/BulkAddFlashcardDataInput";
import { ConfirmationDialog } from "../../components/ConfirmationDialog";
import { Button } from "../../components/Button";
import { IconButton } from "../../components/IconButton";
import { GearIcon } from "../../icons/GearIcon";
import { PlayIcon } from "../../icons/PlayIcon";
import { PlusIcon } from "../../icons/PlusIcon";
import { HitIconLabel } from "../../components/HitIconLabel";
import { MissIconLabel } from "../../components/MissIconLabel";
import { FilterHeader } from "../../components/FilterHeader";
import { Checkbox } from "app/components/Checkbox";
import { ExportIcon } from "app/icons/ExportIcon";
import { ExportedCards } from "app/components/ExportedCards";
import { LoadingIndicator } from "app/components/LoadingIndicator";

export enum DisplayedDialog {
  None,
  AddTagMenu,
  RemoveTagMenu,
  BulkAddFlaschard,
  ExportFlashcardList,
  DeleteFlashcardConfirmationDialog,
  Settings,
}

export interface FlaschardDeckBuilderViewProps {
  filter: FlashcardFilterData;
  onChangeFilter: (filter: FlashcardFilterData) => void;
  onStartPractice: () => void;
}

export const FlaschardDeckBuilderView: React.FC<
  FlaschardDeckBuilderViewProps
> = ({ filter, onChangeFilter, onStartPractice: startPractice }) => {
  const [selectedCardList, setSelectedCardList] = useState<Set<number>>(
    new Set()
  );
  const [showDialog, setShowDialog] = useState(DisplayedDialog.None);
  const cardListContainerRef = useRef<HTMLDivElement | null>(null);

  const flashcardList = useFlaschardList({ filter });

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
  const createFlashcard = useCreateFlaschard();
  const deleteFlashcardList = useDeleteFlashcardList();
  const addTagToFlashcardList = useAddTagToFlashcardList();
  const removeTagFromFlashcardList = useRemoveTagFromFlashcardList();

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

  const onAddFlashcard = useCallback(() => {
    createFlashcard({ tagIdList: filter.include.tagIdList });
    onCardListExpanded();
  }, [createFlashcard, filter, onCardListExpanded]);

  const onBulkAddFlashcard = useCallback(() => {
    setShowDialog(DisplayedDialog.BulkAddFlaschard);
  }, []);

  const onExportFlashcardList = useCallback(() => {
    setShowDialog(DisplayedDialog.ExportFlashcardList);
  }, []);

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

  const onAddTag = useCallback(() => {
    setShowDialog(DisplayedDialog.AddTagMenu);
  }, []);

  const onRemoveTag = useCallback(() => {
    setShowDialog(DisplayedDialog.RemoveTagMenu);
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

  const applyTagToSelectedFlashcardList = useCallback(
    (tagId: FlashcardTagData["id"]) => {
      addTagToFlashcardList(tagId, Array.from(selectedCardList));
    },
    [selectedCardList, addTagToFlashcardList]
  );

  const removeTagFromSelectedFlashcardList = useCallback(
    (tagId: FlashcardTagData["id"]) => {
      removeTagFromFlashcardList(tagId, Array.from(selectedCardList));
    },
    [selectedCardList, removeTagFromFlashcardList]
  );

  const deleteSelectedFlaschardList = useCallback(() => {
    deleteFlashcardList(Array.from(selectedCardList));
  }, [selectedCardList, deleteFlashcardList]);

  const getCardList = () => {
    if (!flashcardList) {
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
      case DisplayedDialog.BulkAddFlaschard:
        return (
          <BulkAddFlashcardDataInput
            onClose={closeDialog}
            initTagIdList={filter.include.tagIdList}
            onBulkAddComplete={onCardListExpanded}
          />
        );
      case DisplayedDialog.ExportFlashcardList:
        return <ExportedCards onClose={closeDialog} filter={filter} />;
      case DisplayedDialog.AddTagMenu:
        return (
          <FlashcardTagMenu
            onClose={closeDialog}
            onSelectTag={applyTagToSelectedFlashcardList}
            isAdding={true}
          />
        );
      case DisplayedDialog.RemoveTagMenu:
        return (
          <FlashcardTagMenu
            onClose={closeDialog}
            onSelectTag={removeTagFromSelectedFlashcardList}
            isAdding={false}
          />
        );
      case DisplayedDialog.DeleteFlashcardConfirmationDialog:
        return (
          <ConfirmationDialog
            text={`Are you sure you want to delete all selected flashcards (${selectedCardList.size})?`}
            onClose={closeDialog}
            onConfirm={deleteSelectedFlaschardList}
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
        <IconButton icon={<PlusIcon />} onClick={onAddFlashcard}>
          Add card
        </IconButton>
        <IconButton icon={<PlusIcon />} onClick={onBulkAddFlashcard}>
          Bulk add
        </IconButton>
        <IconButton icon={<ExportIcon />} onClick={onExportFlashcardList}>
          Export
        </IconButton>
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
            <Button onClick={onAddTag}>Add tag</Button>
            <Button onClick={onRemoveTag}>Remove tag</Button>
            <Button onClick={onDeleteFlashcardList}>Delete</Button>
          </div>
        </>
      ) : null}
      {getDisplayedDialog()}
    </div>
  );
};
