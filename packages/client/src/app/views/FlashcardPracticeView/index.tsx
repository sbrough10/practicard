import React, { useCallback, useEffect, useState } from "react";
import { FlashcardData } from "practicard-shared";
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
import clsx from "clsx";
import { HIT_ICON_COLOR, MISS_ICON_COLOR } from "../../utilities/styles";
import { HitIconLabel } from "../../components/HitIconLabel";
import { ChipAlignment, TagChipList } from "app/components/TagChipList";
import { EllipsesIcon } from "app/icons/EllipsesIcon";
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

  return (
    <div className={classes.root}>
      <div className={classes.buttonBar}>
        <IconButton icon={<BackIcon />} onClick={onExit}>
          Back
        </IconButton>
        <IconButton icon={<PenIcon />} onClick={openSingleCardEditor}>
          Edit
        </IconButton>
        {/* <IconButton icon={<EllipsesIcon />} onClick={openMoreOptionsMenu}>
          More
        </IconButton> */}
        <IconButton icon={<FlipIcon />} onClick={flipCard}>
          Flip
        </IconButton>
      </div>
      <Menu
        open={!!moreOptionsMenuAnchor}
        anchorEl={moreOptionsMenuAnchor}
        onClose={closeMoreOptionsMenu}
      >
        <MenuItem onClick={openSingleCardEditor}>
          <PenIcon size={16} fillColor="black" />
          Edit card
        </MenuItem>
        <MenuItem onClick={goToNextCard}>
          <NextIcon size={16} fillColor="black" />
          Skip card
        </MenuItem>
      </Menu>
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
          {/* <div className={classes.hitMissButtonSection}>
            <IconButton
              className={clsx(classes.hitMissButton, "miss-button")}
              icon={<ExIcon fillColor={MISS_ICON_COLOR} />}
              onClick={markCardAsMiss}
            ></IconButton>
            <IconButton
              className={clsx(classes.hitMissButton, "hit-button")}
              icon={<CheckIcon fillColor={HIT_ICON_COLOR} />}
              onClick={markCardAsHit}
            ></IconButton>
          </div> */}
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
