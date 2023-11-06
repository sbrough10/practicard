import { app, hasQueryParam } from "./init";
import { ApiPath } from "practicard-shared";
import { Database } from "../database";
import { hasWorkspaceSession } from "./session";

app.get(ApiPath.FlashcardById, hasWorkspaceSession, async (req, res) => {
  const { flashcardId } = req.params;
  const { userId } = req.cookies;

  res.send(await Database.getFlashcard(parseInt(flashcardId), userId));
});

app.get(
  ApiPath.Flashcard,
  hasWorkspaceSession,
  hasQueryParam("filter"),
  async (req, res) => {
    const { userId, workspaceId } = req.cookies;
    const { filter } = req.query;

    res.send(
      await Database.getFlashcardList(
        JSON.parse(String(filter)),
        userId,
        workspaceId
      )
    );
  }
);

app.post(ApiPath.Flashcard, hasWorkspaceSession, async (req, res) => {
  const { userId, workspaceId } = req.cookies;

  res.send(
    await Database.createFlashcardList(
      req.body,
      parseInt(userId),
      parseInt(workspaceId)
    )
  );
});

app.put(ApiPath.FlashcardById, hasWorkspaceSession, async (req, res) => {
  const { userId } = req.cookies;
  const { flashcardId } = req.params;

  await Database.updateFlashcard(req.body, parseInt(flashcardId), userId);

  res.send({});
});

app.delete(ApiPath.Flashcard, hasWorkspaceSession, async (req, res) => {
  await Database.deleteFlashcard(req.body);

  res.send({});
});

app.put(ApiPath.FlashcardTagIdList, hasWorkspaceSession, async (req, res) => {
  const { addedTagIdList, removedTagIdList, flashcardIdList } = req.body;
  await Database.changeTagListForFlashcardList(
    addedTagIdList,
    removedTagIdList,
    flashcardIdList
  );

  res.send({});
});
