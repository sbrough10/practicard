import { app } from "./init";
import { Database } from "../database";

app.get("/initiate-migration", async (req, res) => {
  await Database.deleteDefaultFlashcardSuccessRecords();
  await Database.makeFlashcardSuccessUniquelyConstrained();

  res.send("All redundant flashcard success records have been deleted");
});
