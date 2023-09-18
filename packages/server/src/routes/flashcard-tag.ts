import { app } from "./init";
import { ApiPath } from "practicard-shared";
import { Database } from "../database";
import { hasWorkspaceSession } from "./session";
import { keyBy } from "lodash";

app.get(ApiPath.FlashcardTag, hasWorkspaceSession, async (req, res) => {
  const { workspaceId } = req.cookies;

  const tagList = await Database.getFlashcardTagList(workspaceId);

  res.send(keyBy(tagList, "id"));
});

app.post(ApiPath.FlashcardTag, hasWorkspaceSession, async (req, res) => {
  const { workspaceId } = req.cookies;
  const { labelList } = req.body;

  if (labelList.length > 0) {
    const tagList = await Database.createFlashcardTagList(
      labelList,
      workspaceId
    );
    res.send(tagList);
    return;
  }

  res.send([]);
});
