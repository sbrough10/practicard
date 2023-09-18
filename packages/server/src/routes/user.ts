import { app, hasBodyParam } from "./init";
import { ApiPath } from "practicard-shared";
import { Database } from "../database";

app.get(ApiPath.User, async (req, res) => {
  res.send(await Database.getUserList());
});

app.post(ApiPath.User, hasBodyParam("displayName"), async (req, res) => {
  const newUser = await Database.createUser(req.params.displayName);
  res.send(newUser);
});
