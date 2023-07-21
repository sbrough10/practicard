import {
  PostgressDatabase,
  SqlBigInt,
  SqlSmallInt,
  SqlTinyInt,
  Varchar,
} from "database-utility";

const pgDb = new PostgressDatabase(
  process.env.DATABASE_URL ||
    `postgres://postgres:postgres@localhost:5432/practicard`
);

const flaschcardTable = pgDb.createTable("Flashcard", {
  id: SqlBigInt,
  frontText: new Varchar(256),
  backText: new Varchar(256),
  tagIdList: new Varchar(1024),
  workspaceId: SqlTinyInt,
});

const workspaceTable = pgDb.createTable("Workspace", {
  id: SqlSmallInt,
  displayName: new Varchar(128),
});

const userTable = pgDb.createTable("User", {
  id: SqlSmallInt,
  displayName: new Varchar(128),
  workspaceIdList: new Varchar(256),
});

const flashcardSuccessTable = pgDb.createTable("FlashcardSuccess", {
  hits: SqlSmallInt,
  misses: SqlSmallInt,
  flashcardId: SqlBigInt,
  userId: SqlSmallInt,
});

const flashcardTag = pgDb.createTable("FlashcardTag", {
  id: SqlSmallInt,
  label: new Varchar(256),
});

pgDb.init();

export const Database = {};
