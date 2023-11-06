import React, { useCallback, useState } from "react";
import { FlashcardData, FlashcardTagData } from "practicard-shared";
import { classes } from "./styles";
import { RecordButton } from "../RecordingButton";
import {
  useAddTagToFlashcardList,
  useIsFlashcardRecentlyCreated,
  useRemoveTagFromFlashcardList,
  useUpdateFlashcard,
} from "../../state";
import { HitIconLabel } from "../HitIconLabel";
import { MissIconLabel } from "../MissIconLabel";
import { displayHitPercentage } from "../../utilities/common";
import { TagChipList } from "../TagChipList";
import { TextField } from "../TextField";
import {
  convertAudioBlobListToStringList,
  convertStringListToAudioBlobList,
} from "../../utilities/audio";
import clsx from "clsx";
import { Checkbox } from "app/components/Checkbox";

export interface FlashcardDataRowProps {
  data: FlashcardData;
  selected?: boolean;
  onChangeSelect?: (id: number, isSelected: boolean) => void;
}

export const FlashcardDataRow: React.FC<FlashcardDataRowProps> = ({
  data,
  selected,
  onChangeSelect,
}) => {
  const [isValueSetSuspended, setIsValueSetSuspended] = useState(false);

  const updateFlashcard = useUpdateFlashcard();

  const suspendValueSet = useCallback(() => setIsValueSetSuspended(true), []);
  const unsuspendValueSet = useCallback(
    () => setIsValueSetSuspended(false),
    []
  );

  const { id } = data;

  const isRecentlyCreated = useIsFlashcardRecentlyCreated(id);

  const handleOnChangeSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChangeSelect?.(id, event.target.checked);
    },
    [id, onChangeSelect]
  );

  const updateFrontText = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      updateFlashcard(id, { frontText: event.target.value });
    },
    [id, updateFlashcard]
  );

  const updateFrontAudioRecording = useCallback(
    async (audioData: Blob[] | undefined) => {
      updateFlashcard(id, {
        frontAudioRecording:
          audioData && (await convertAudioBlobListToStringList(audioData)),
      });
    },
    [updateFlashcard]
  );

  const updateBackText = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      updateFlashcard(id, { backText: event.target.value });
    },
    [id, updateFlashcard]
  );

  const updateBackAudioRecording = useCallback(
    async (audioData: Blob[] | undefined) => {
      updateFlashcard(id, {
        backAudioRecording:
          audioData && (await convertAudioBlobListToStringList(audioData)),
      });
    },
    [updateFlashcard]
  );

  const updateHits = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      let newNum = parseInt(event.target.value) ?? 0;
      if (newNum < 0) {
        newNum = 0;
      }
      updateFlashcard(id, { hits: newNum });
      unsuspendValueSet();
    },
    [updateFlashcard]
  );

  const updateMisses = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      let newNum = parseInt(event.target.value) ?? 1;
      if (newNum < 1) {
        newNum = 1;
      }
      updateFlashcard(id, { misses: newNum });
      unsuspendValueSet();
    },
    [updateFlashcard]
  );

  const editTagList = useCallback(
    (tagIdList: FlashcardTagData["id"][]) => {
      updateFlashcard(id, { tagIdList });
    },
    [updateFlashcard]
  );

  return (
    <div
      className={clsx(
        classes.root,
        isRecentlyCreated ? classes.recentlyCreated : classes.normal
      )}
    >
      {onChangeSelect ? (
        <Checkbox
          checked={selected}
          className={classes.checkbox}
          onChange={handleOnChangeSelect}
        />
      ) : null}
      <div className={classes.inputSection}>
        <div className={classes.row}>
          <div className={classes.cardTextSection}>
            <TextField
              placeholder="Front side text"
              className={classes.cardSide}
              type="text"
              {...(isValueSetSuspended ? {} : { value: data.frontText })}
              onFocus={suspendValueSet}
              onBlur={updateFrontText}
              // rightPadContent={
              //   <RecordButton
              //     audioData={
              //       data.frontAudioRecording &&
              //       convertStringListToAudioBlobList(data.frontAudioRecording)
              //     }
              //     onUpdate={updateFrontAudioRecording}
              //   />
              // }
            />
            <TextField
              placeholder="Back side text"
              className={classes.cardSide}
              type="text"
              {...(isValueSetSuspended ? {} : { value: data.backText })}
              onFocus={suspendValueSet}
              onBlur={updateBackText}
              // rightPadContent={
              //   <RecordButton
              //     audioData={
              //       data.backAudioRecording &&
              //       convertStringListToAudioBlobList(data.backAudioRecording)
              //     }
              //     onUpdate={updateBackAudioRecording}
              //   />
              // }
            />
          </div>
          <div className={classes.hitMissSection}>
            <div className={classes.hitMissLabel}>
              <HitIconLabel />
            </div>
            <TextField
              className={classes.hitMissInput}
              type="number"
              min="0"
              step="1"
              {...(isValueSetSuspended ? {} : { value: data.hits })}
              onFocus={suspendValueSet}
              onBlur={updateHits}
            />
            <div className={classes.hitMissLabel}>
              <MissIconLabel />
            </div>
            <TextField
              className={classes.hitMissInput}
              type="number"
              min="1"
              step="1"
              {...(isValueSetSuspended ? {} : { value: data.misses })}
              onFocus={suspendValueSet}
              onBlur={updateMisses}
            />
            <div className={classes.hitPercentage}>
              {displayHitPercentage(data)}
              <div className={classes.hitPercentageIcon}>
                <HitIconLabel size={20} />
              </div>
            </div>
          </div>
        </div>
        <div className={classes.row}>
          <TagChipList tagIdList={data.tagIdList} onEditList={editTagList} />
        </div>
      </div>
    </div>
  );
};
