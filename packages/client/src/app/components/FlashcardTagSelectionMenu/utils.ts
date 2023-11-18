import { FlashcardData, FlashcardTagData } from "practicard-shared";

export interface FlashcardTagListSelectionStatus {
  checkedTagSet: Set<FlashcardTagData["id"]>;
  indeterminateTagSet: Set<FlashcardTagData["id"]>;
}

export const getTagSelectionStatus = (
  flashcardList: FlashcardData[]
): FlashcardTagListSelectionStatus => {
  const results: FlashcardTagListSelectionStatus = {
    checkedTagSet: new Set(),
    indeterminateTagSet: new Set(),
  };

  const tagIdToInclusionCountMap: Record<FlashcardTagData["id"], number> = {};

  flashcardList.forEach((flashcard) => {
    flashcard.tagIdList.forEach((tagId) => {
      tagIdToInclusionCountMap[tagId] =
        1 + (tagIdToInclusionCountMap[tagId] ?? 0);
    });
  });

  for (const key in tagIdToInclusionCountMap) {
    const tagId = parseInt(key);
    if (tagIdToInclusionCountMap[tagId] < flashcardList.length) {
      results.indeterminateTagSet.add(tagId);
    } else {
      results.checkedTagSet.add(tagId);
    }
  }

  return results;
};
