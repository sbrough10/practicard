import { app } from "./init";
import { ApiPath } from "practicard-shared";
import { Database } from "../database";

app.get(ApiPath.Workspace, async (req, res) => {
  res.send(await Database.getWorkspaceList());
});
