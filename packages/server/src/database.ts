import {
  CalculatedConfig,
  Condition,
  Expression,
  PostgressDatabase,
  SequenceConfig,
  SqlBoolean,
  SqlFloat8,
  SqlInt,
  SqlSmallInt,
  Varchar,
  and,
  andEq,
  asc,
  caseWhen,
  concat,
  eq,
  f,
  isNull,
  like,
  lt,
  match,
  op,
  or,
  replace,
} from "database-utility";
import {
  FlashcardCreationData,
  FlashcardData,
  FlashcardFilterData,
  FlashcardTagData,
  FlashcardTagUpdateData,
  FlashcardUpdateData,
  UserData,
  WorkspaceData,
} from "practicard-shared";
import { generateSessionId } from "./utilities";
import { pick } from "lodash";

const pgDb = new PostgressDatabase(
  process.env.DATABASE_URL ||
    `postgres://postgres:postgres@localhost:5432/practicard`
);

const flashcardTable = pgDb.createTable(
  "Flashcard",
  {
    frontText: new Varchar(256),
    backText: new Varchar(256),
    tagIdList: new Varchar(1024),
    workspaceId: SqlInt,
    isDeleted: SqlBoolean,
  },
  {
    generatedFields: {
      id: {
        type: SqlInt,
        config: new SequenceConfig({ startWith: 0, incrementBy: 1 }),
      },
    },
  }
);

const workspaceTable = pgDb.createTable(
  "Workspace",
  {
    displayName: new Varchar(128),
    isDeleted: SqlBoolean,
  },
  {
    generatedFields: {
      id: {
        type: SqlInt,
      },
    },
  }
);

const userTable = pgDb.createTable(
  "User",
  {
    displayName: new Varchar(128),
    isDeleted: SqlBoolean,
  },
  {
    generatedFields: {
      id: {
        type: SqlInt,
      },
    },
  }
);

const sessionTable = pgDb.createTable("Session", {
  token: new Varchar(64),
  userId: SqlInt,
  workspaceId: SqlInt,
});

const flashcardSuccessTable = pgDb.createTable(
  "FlashcardSuccess",
  {
    hits: SqlSmallInt,
    misses: SqlSmallInt,
    flashcardId: SqlInt,
    userId: SqlInt,
  },
  {
    generatedFields: {
      hitPercentage: {
        type: SqlFloat8,
        config: new CalculatedConfig(
          op(f`hits`, "/", op(f`misses`, "+", f`hits`), true)
        ),
      },
    },
  }
);

const flashcardTagTable = pgDb.createTable(
  "FlashcardTag",
  {
    label: new Varchar(256),
    workspaceId: SqlInt,
    isDeleted: SqlBoolean,
  },
  {
    generatedFields: {
      id: {
        type: SqlInt,
        config: new SequenceConfig({ startWith: 0, incrementBy: 1 }),
      },
    },
  }
);

pgDb.init();

type DbFlashcardSuccessData = Pick<FlashcardData, "hits" | "misses">;

type DbFlashcardData = Omit<FlashcardData, keyof DbFlashcardSuccessData> & {
  tagIdList: string;
};

type DbJoinFlashcardData = DbFlashcardData & DbFlashcardSuccessData;

const numListToString = (list: number[]) =>
  list.length > 0 ? `|${list.join("|")}|` : "|";
const stringToNumList = (joinedList: string) =>
  joinedList.length > 1
    ? joinedList
        .substring(1, joinedList.length - 1)
        .split("|")
        .map((item) => parseInt(item))
    : [];
const hasNumInList = (list: Expression, item: number) => {
  return like(list, `%|${item}|%`);
};
const withNumInList = (list: Expression, item: number) => {
  return concat(list, `${item}|`);
};
const sansNumInList = (list: Expression, item: number) => {
  return replace(list, `|${item}|`, "|");
};

const convertDbFlashcardData = (dbData: DbJoinFlashcardData): FlashcardData => {
  return { ...dbData, tagIdList: stringToNumList(dbData.tagIdList) };
};

export const Database = {
  async createUser(displayName: string): Promise<UserData> {
    const query = await userTable.insert(
      [{ displayName, isDeleted: false }],
      ["id", "displayName"]
    );

    return query.rows[0];
  },

  async getUserList() {
    return (await userTable.selectAll(eq(f`isDeleted`, false)))
      .rows as UserData[];
  },

  async createWorkspace(displayName: string): Promise<WorkspaceData> {
    const query = await workspaceTable.insert(
      [{ displayName, isDeleted: false }],
      ["id", "displayName"]
    );

    return query.rows[0];
  },

  async getWorkspaceList() {
    return (await workspaceTable.selectAll(eq(f`isDeleted`, false)))
      .rows as WorkspaceData[];
  },

  async createSession(
    userId: UserData["id"],
    workspaceId: WorkspaceData["id"]
  ) {
    const token = generateSessionId();
    await sessionTable.insert([{ userId, workspaceId, token }]);

    return token;
  },

  async hasSession(
    userId: UserData["id"],
    workspaceId: WorkspaceData["id"],
    token: string
  ) {
    const query = await sessionTable.selectAll(
      andEq({ userId, workspaceId, token })
    );

    return query.rowCount > 0;
  },

  async deleteSession(
    userId: UserData["id"],
    workspaceId: WorkspaceData["id"],
    token: string
  ) {
    const query = await sessionTable.delete(
      andEq({ userId, workspaceId, token })
    );

    return query.rowCount > 0;
  },

  async selectFlashcard(
    userId: UserData["id"],
    where?: Condition
  ): Promise<FlashcardData[]> {
    return (
      await flashcardTable.select(
        [
          ...flashcardTable.fl("frontText", "backText", "id", "tagIdList"),
          ...flashcardSuccessTable.fl("hits", "misses"),
        ],
        flashcardSuccessTable.innerJoin(
          and(
            eq(flashcardSuccessTable.f`userId`, userId),
            eq(flashcardTable.f`id`, flashcardSuccessTable.f`flashcardId`)
          )
        ),
        and(
          ...(where ? [where] : []),
          and(eq(flashcardTable.f`isDeleted`, false))
        ),
        asc(flashcardTable.f`id`)
      )
    ).rows.map((row) => convertDbFlashcardData(row as DbJoinFlashcardData));
  },

  async getFlashcard(id: FlashcardData["id"], userId: UserData["id"]) {
    const result = await this.selectFlashcard(
      userId,
      eq(flashcardTable.f`id`, id)
    );

    return result[0];
  },

  async getFlashcardList(
    filter: FlashcardFilterData,
    userId: UserData["id"],
    workspaceId: WorkspaceData["id"]
  ) {
    const { tagIdList, text, maxHitPercentage } = filter.include;

    const filterCondition = and(
      or(
        match(flashcardTable.f`frontText`, `.*${text}.*`, false),
        match(flashcardTable.f`backText`, `.*${text}.*`, false)
      ),
      ...(tagIdList.length > 0
        ? [
            or(
              ...tagIdList.map((tagId) =>
                hasNumInList(flashcardTable.f`tagIdList`, tagId)
              )
            ),
          ]
        : []),
      lt(flashcardSuccessTable.f`hitPercentage`, maxHitPercentage)
    );

    const result = await this.selectFlashcard(
      userId,
      and(filterCondition, eq(flashcardTable.f`workspaceId`, workspaceId))
    );

    return result;
  },

  async createFlashcard(
    data: FlashcardCreationData,
    userId: UserData["id"],
    workspaceId: WorkspaceData["id"]
  ) {
    const {
      hits,
      misses,
      frontAudioRecording,
      backAudioRecording,
      tagIdList,
      ...flashcardData
    } = data;
    const flashcardId = (
      await flashcardTable.insert(
        [
          {
            tagIdList: numListToString(tagIdList),
            ...flashcardData,
            isDeleted: false,
            workspaceId,
          },
        ],
        ["id"]
      )
    ).rows[0].id;

    await flashcardSuccessTable.insert([
      {
        userId,
        flashcardId,
        hits,
        misses,
      },
    ]);
  },

  async createFlashcardList(
    data: FlashcardCreationData[],
    userId: UserData["id"],
    workspaceId: WorkspaceData["id"]
  ): Promise<FlashcardData[]> {
    const dbFlashcardList: DbFlashcardData[] = (
      await flashcardTable.insert(
        data.map(
          ({
            hits,
            misses,
            frontAudioRecording,
            backAudioRecording,
            tagIdList,
            ...flashcardData
          }) => ({
            tagIdList: numListToString(tagIdList),
            ...flashcardData,
            isDeleted: false,
            workspaceId,
          })
        ),
        ["id", "frontText", "backText", "tagIdList"]
      )
    ).rows;

    await flashcardSuccessTable.insert(
      data.map(({ hits, misses }, index) => ({
        userId,
        flashcardId: dbFlashcardList[index].id,
        hits,
        misses,
      }))
    );

    return dbFlashcardList.map((flashcard, index) =>
      convertDbFlashcardData({
        ...flashcard,
        ...pick(data[index], "hits", "misses"),
      })
    );
  },

  async updateFlashcard(
    data: FlashcardUpdateData,
    id: FlashcardData["id"],
    userId: UserData["id"]
  ) {
    const {
      hits,
      misses,
      frontAudioRecording,
      backAudioRecording,
      tagIdList,
      ...flashcardData
    } = data;

    const successData = pick(data, ["hits", "misses"]);

    if (Object.keys(successData).length > 0) {
      await flashcardSuccessTable.update(
        successData,
        andEq({ flashcardId: id, userId })
      );
    }

    // TODO - We will probably never update `tagIdList` this way
    const updateValues = {
      ...(tagIdList ? { tagIdList: numListToString(tagIdList) } : {}),
      ...flashcardData,
    };

    if (Object.keys(updateValues).length > 0) {
      await flashcardTable.update(updateValues, eq(f`id`, id));
    }
  },

  async deleteFlashcard(idList: FlashcardData["id"][]) {
    await flashcardTable.update(
      { isDeleted: true },
      or(...idList.map((id) => eq(f`id`, id)))
    );

    await flashcardSuccessTable.delete(
      or(...idList.map((id) => eq(f`flashcardId`, id)))
    );
  },

  async createMissingUserFlashcardSuccessRecords(
    userId: UserData["id"],
    workspaceId: WorkspaceData["id"]
  ) {
    const idList = (
      await flashcardTable.select(
        [flashcardTable.f`id`],
        flashcardSuccessTable.leftJoin(
          and(
            eq(flashcardTable.f`id`, flashcardSuccessTable.f`flashcardId`),
            eq(flashcardSuccessTable.f`userId`, userId),
            eq(flashcardTable.f`workspaceId`, workspaceId)
          )
        ),
        isNull(flashcardSuccessTable.f`userId`)
      )
    ).rows.map((row) => row.id as FlashcardData["id"]);

    const defaultValues = {
      hits: 0,
      misses: 1,
      userId,
    };

    if (idList.length > 0) {
      await flashcardSuccessTable.insert(
        idList.map((id) => ({ ...defaultValues, flashcardId: id }))
      );
    }
  },

  async changeTagListForFlashcardList(
    addedTagIdList: FlashcardTagData["id"][],
    removedTagIdList: FlashcardTagData["id"][],
    flashcardIdList: FlashcardData["id"][]
  ) {
    for (const tagId of addedTagIdList) {
      await flashcardTable.update(
        {
          tagIdList: caseWhen(
            [hasNumInList(f`tagIdList`, tagId).then(f`tagIdList`)],
            withNumInList(f`tagIdList`, tagId)
          ),
        },
        or(...flashcardIdList.map((id) => eq(f`id`, id)))
      );
    }

    for (const tagId of removedTagIdList) {
      await flashcardTable.update(
        {
          tagIdList: sansNumInList(f`tagIdList`, tagId),
        },
        or(...flashcardIdList.map((id) => eq(f`id`, id)))
      );
    }
  },

  async getFlashcardTagList(workspaceId: WorkspaceData["id"]) {
    const result = await flashcardTagTable.select(
      ["id", "label"],
      andEq({ isDeleted: false, workspaceId })
    );

    return result.rows.map((row) => ({
      ...row,
      // I don't know why, but these number fields always return as strings
      id: parseInt(row.id as string),
    })) as FlashcardTagData[];
  },

  async createFlashcardTagList(
    labelList: string[],
    workspaceId: WorkspaceData["id"]
  ) {
    const result = await flashcardTagTable.insert(
      labelList.map((label) => ({ label, workspaceId, isDeleted: false })),
      ["id", "label"]
    );

    return result.rows as FlashcardTagData[];
  },

  async updateFlashcardTag(
    id: FlashcardTagData["id"],
    data: FlashcardTagUpdateData
  ) {
    await flashcardTagTable.update(data, eq(f`id`, id));
  },

  async deleteFlashcardTag(
    workspaceId: WorkspaceData["id"],
    tagId: FlashcardTagData["id"]
  ) {
    await flashcardTagTable.delete(eq(f`id`, tagId));

    await flashcardTable.update(
      {
        tagIdList: sansNumInList(f`tagIdList`, tagId),
      },
      eq(f`workspaceId`, workspaceId)
    );
  },
};
