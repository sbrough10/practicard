const API_PATH_PREFIX = "/api/v1";

export const ApiPath = {
  User: API_PATH_PREFIX + "/user",
  Workspace: API_PATH_PREFIX + "/workspace",
  Session: API_PATH_PREFIX + "/session",
  FlashcardById: API_PATH_PREFIX + "/flashcard/:flashcardId",
  Flashcard: API_PATH_PREFIX + "/flashcard",
  FlashcardWithNewTags: API_PATH_PREFIX + "/flashcard/withNewTags",
  FlashcardTag: API_PATH_PREFIX + "/flashcardTag",
  FlashcardTagIdList: API_PATH_PREFIX + "/flashcard/tagList",
  FlashcardDeck: API_PATH_PREFIX + "/flashcardDeck",
  FlashcardDeckMaxHitPercentage:
    API_PATH_PREFIX + "/flashcardDeck/maxHitPercentage",
  FlashcardDeckPickFlashcard: API_PATH_PREFIX + "/flashcardDeck/pickFlashcard",
};

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

export type FlashcardCreationData = Omit<FlashcardData, "id">;
export type FlashcardUpdateData = Partial<FlashcardCreationData>;
export type NewTagToFlashcardMap = {
  [tagLabel: string]: FlashcardCreationData[];
};

export interface CreateFlashcardListAndTagList {
  tagList: FlashcardTagData[];
  flashcardList: FlashcardData[];
}

export const defaultFlashcardData: FlashcardCreationData = {
  frontText: "",
  backText: "",
  hits: 0,
  misses: 1,
  tagIdList: [],
};

export interface FlashcardDeckData {
  /** IDs for flashcards included in the testing rotation for the deck */
  activeFlashcardIdList: number[];
  /** IDs for flashcards that have been removed from the testing rotation */
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

export interface UserData {
  id: number;
  displayName: string;
}

export interface WorkspaceData {
  id: number;
  displayName: string;
}

export interface SessionCreationParams {
  user: { id: UserData["id"] } | { displayName: string };
  workspace: { id: WorkspaceData["id"] } | { displayName: string };
}

export const getHitPercentage = ({
  hits,
  misses,
}: Pick<FlashcardData, "hits" | "misses">) => {
  return hits / (hits + misses);
};
