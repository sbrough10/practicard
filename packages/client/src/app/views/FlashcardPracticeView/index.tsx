import React, { useCallback, useEffect, useState } from "react";
import {
  useActiveDeckCardCount,
  useActiveFlashcard,
  useIsPickingNextFlashcard,
  usePickNewFlashcard,
  useUpdateFlashcard,
} from "../../state";
import { displayHitPercentage } from "../../utilities/common";
import { classes } from "./styles";
import { IconButton } from "../../components/IconButton";
import { BackIcon } from "../../icons/BackIcon";
import { FlipIcon } from "../../icons/FlipIcon";
import { ExIcon } from "../../icons/ExIcon";
import { CheckIcon } from "../../icons/CheckIcon";
import { HIT_ICON_COLOR, MISS_ICON_COLOR } from "../../utilities/styles";
import { HitIconLabel } from "../../components/HitIconLabel";
import { ChipAlignment, TagChipList } from "app/components/TagChipList";
import { Menu } from "app/components/Menu";
import { MenuItem } from "app/components/MenuItems";
import { PenIcon } from "app/icons/PenIcon";
import { NextIcon } from "app/icons/NextIcon";
import { SingleFlashcardEditor } from "app/components/SingleFlashcardEditor";
import { LoadingIndicator } from "app/components/LoadingIndicator";

export interface FlashcardPracticeViewProps {
  onExit: () => void;
}

export const FlashcardPracticeView: React.FC<FlashcardPracticeViewProps> = ({
  onExit,
}) => {
  const [moreOptionsMenuAnchor, setMoreOptionsMenuAnchor] =
    useState<HTMLButtonElement | null>(null);
  const [showSingleCardEditor, setShowSingleCardEditor] = useState(false);

  const updateFlashcard = useUpdateFlashcard();
  const pickFlashcard = usePickNewFlashcard();
  const currentFlashcard = useActiveFlashcard(0);
  const cardCount = useActiveDeckCardCount();
  const isPickingNextCard = useIsPickingNextFlashcard();

  const [isCardFlipped, setIsCardFlipped] = useState(false);

  useEffect(() => {
    pickFlashcard(0);
  }, []);

  const openMoreOptionsMenu = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setMoreOptionsMenuAnchor(event.currentTarget);
    },
    []
  );

  const closeMoreOptionsMenu = useCallback(() => {
    setMoreOptionsMenuAnchor(null);
  }, []);

  const flipCard = useCallback(() => {
    setIsCardFlipped((isCardFlipped) => !isCardFlipped);
  }, []);

  const openSingleCardEditor = useCallback(() => {
    setShowSingleCardEditor(true);
  }, []);

  const closeSingleCardEditor = useCallback(() => {
    setShowSingleCardEditor(false);
  }, []);

  const goToNextCard = useCallback(() => {
    setIsCardFlipped(false);
    pickFlashcard(0);
  }, [pickFlashcard]);

  const markCardAsHit = useCallback(() => {
    if (!currentFlashcard) {
      return;
    }
    updateFlashcard(currentFlashcard.id, { hits: currentFlashcard.hits + 1 });
    goToNextCard();
  }, [currentFlashcard, updateFlashcard, goToNextCard]);

  const markCardAsMiss = useCallback(() => {
    if (!currentFlashcard) {
      return;
    }
    updateFlashcard(currentFlashcard.id, {
      misses: currentFlashcard.misses + 1,
    });
    goToNextCard();
  }, [currentFlashcard, updateFlashcard, goToNextCard]);

  const onKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (showSingleCardEditor) {
        return;
      }
      switch (event.key.toUpperCase()) {
        case "Q":
          return onExit();
        case "P":
          return openSingleCardEditor();
        case "F":
          return flipCard();
        case "N":
          return markCardAsMiss();
        case "S":
          return goToNextCard();
        case "Y":
          return markCardAsHit();
      }
    },
    [
      onExit,
      openSingleCardEditor,
      flipCard,
      markCardAsMiss,
      goToNextCard,
      markCardAsHit,
      showSingleCardEditor,
    ]
  );

  useEffect(() => {
    document.body.addEventListener("keypress", onKeyPress);

    return () => {
      document.body.removeEventListener("keypress", onKeyPress);
    };
  }, [onKeyPress]);

  return (
    <div className={classes.root}>
      <div className={classes.buttonBar}>
        <IconButton icon={<BackIcon />} onClick={onExit}>
          Back
        </IconButton>
        <IconButton icon={<PenIcon />} onClick={openSingleCardEditor}>
          Edit
        </IconButton>
        <IconButton icon={<FlipIcon />} onClick={flipCard}>
          Flip
        </IconButton>
      </div>
      {currentFlashcard ? (
        <TagChipList
          tagIdList={currentFlashcard.tagIdList}
          chipAlignment={ChipAlignment.Center}
        />
      ) : null}
      <div className={classes.cardText}>
        {isPickingNextCard ? (
          <LoadingIndicator />
        ) : currentFlashcard ? (
          isCardFlipped ? (
            currentFlashcard.backText
          ) : (
            currentFlashcard.frontText
          )
        ) : (
          "There are no more flashcards active in this deck"
        )}
      </div>
      {!isPickingNextCard && currentFlashcard ? (
        <>
          <div className={classes.addedDetails}>
            <div>
              {displayHitPercentage(currentFlashcard)}
              <HitIconLabel size={20} />
            </div>
            <div>Card Count: {cardCount}</div>
          </div>
          <div className={classes.buttonBar}>
            <IconButton
              icon={<ExIcon fillColor={MISS_ICON_COLOR} />}
              onClick={markCardAsMiss}
            >
              Incorrect
            </IconButton>
            <IconButton icon={<NextIcon />} onClick={goToNextCard}>
              Skip
            </IconButton>
            <IconButton
              icon={<CheckIcon fillColor={HIT_ICON_COLOR} />}
              onClick={markCardAsHit}
            >
              Correct
            </IconButton>
          </div>
          {showSingleCardEditor && (
            <SingleFlashcardEditor
              data={currentFlashcard}
              onClose={closeSingleCardEditor}
            />
          )}
        </>
      ) : null}
    </div>
  );
};
