import { FlashcardState } from "./flashcard.types";
import { FlashcardTagState } from "./flashcard-tag.types";
import { FlashcardDeckState } from "./flashcard-deck.types";
import { SessionState } from "./session.types";
import { UserState } from "./user.types";
import { WorkspaceState } from "./workspace.types";

export interface FullState {
  flashcard: FlashcardState;
  flashcardTag: FlashcardTagState;
  flashcardDeck: FlashcardDeckState;
  session: SessionState;
  user: UserState;
  workspace: WorkspaceState;
}
