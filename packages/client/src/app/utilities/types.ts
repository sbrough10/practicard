export interface FlashcardData {
  id: number;
  frontText: string;
  frontAudioRecording?: string[];
  backText: string;
  backAudioRecording?: string[];
  hits: number;
  misses: number;
  tagIdList: number[];
}

export interface FlashcardTagData {
  id: number;
  label: string;
}

export interface FlaschardDeckData {
  /** IDs for flashcards included in the testing rotation for the deck */
  activeFlashcardIdList: number[];
  /** IDs for flaschards that have been removed from the testing rotation */
  inactiveFlashcardIdList: number[];
}

export interface FlashcardFilterData {
  include: {
    text: string;
    onlyNoTag: boolean;
    noTag: boolean;
    tagIdList: FlashcardData["id"][];
    maxHitPercentage: number;
  };
  exclude: {
    tagIdList: FlashcardData["id"][];
  };
}

export const defaultFlashcardFilterData: FlashcardFilterData = {
  include: {
    text: "",
    onlyNoTag: false,
    noTag: false,
    tagIdList: [],
    maxHitPercentage: 1,
  },
  exclude: {
    tagIdList: [],
  },
};
