import { app, hasBodyParam, hasCookieParam } from "./init";
import {
  ApiPath,
  SessionCreationParams,
  UserData,
  WorkspaceData,
} from "practicard-shared";
import { Database } from "../database";
import { Request, RequestHandler } from "express";

const hasUserId = (
  obj: SessionCreationParams["user"]
): obj is { id: UserData["id"] } => {
  return "id" in obj;
};

const hasWorkspaceId = (
  obj: SessionCreationParams["workspace"]
): obj is { id: WorkspaceData["id"] } => {
  return "id" in obj;
};

app.post(
  ApiPath.Session,
  hasBodyParam("user"),
  hasBodyParam("workspace"),
  async (req, res) => {
    const params: SessionCreationParams = req.body;
    const userId = hasUserId(params.user)
      ? params.user.id
      : (await Database.createUser(params.user.displayName)).id;
    const workspaceId = hasWorkspaceId(params.workspace)
      ? params.workspace.id
      : (await Database.createWorkspace(params.workspace.displayName)).id;

    Database.createMissingUserFlashcardSuccessRecords(userId, workspaceId);

    const token = await Database.createSession(userId, workspaceId);
    res
      .cookie("userId", userId)
      .cookie("workspaceId", workspaceId)
      .cookie("token", token)
      .send({});
  }
);

const getHasSession = async (req: Request) => {
  const { userId, workspaceId, token } = req.cookies;

  if (!userId || !workspaceId || !token) {
    return false;
  }

  const hasSession = await Database.hasSession(userId, workspaceId, token);

  return hasSession;
};

export const hasWorkspaceSession: RequestHandler = async (req, res, next) => {
  if (await getHasSession(req)) {
    next();
    return;
  }
  res.status(401).send("Session not successfully authenticated");
};

app.get(ApiPath.Session, async (req, res) => {
  res.send({ hasSession: await getHasSession(req) });
});

app.delete(
  ApiPath.Session,
  hasCookieParam("userId"),
  hasCookieParam("workspaceId"),
  hasCookieParam("token"),
  async (req, res) => {
    const { userId, workspaceId, token } = req.cookies;

    await Database.deleteSession(userId, workspaceId, token);

    res
      .clearCookie("userId")
      .clearCookie("workspaceId")
      .clearCookie("token")
      .send({});
  }
);
