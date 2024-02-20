import * as pg from "pg";
import _ from "lodash";
import {
  CalculatedConfig,
  f,
  GeneratedTableFields,
  handleSqlValue,
  SequenceConfig,
  sequenceConfigToString,
  SqlValue,
  TableField,
  TableFields,
  TableValues,
} from "./utils";
import { Condition } from "./conditions";
import { buildClauseString, Clause, Join, JoinType } from "./clauses";
import { Expression, getExpToString } from "./operations";
import { Alias, SelectExpression } from "./select";

export { alias, min, max } from "./select";
export * from "./data-types";
export { caseWhen } from "./case";
export type { Limit, Offset } from "./clauses";
export { groupBy, limit, offset } from "./clauses";
export * from "./conditions";
export { concat, op, replace } from "./operations";
export type { Expression } from "./operations";
export type { Order, SortExpression } from "./order";
export { asc, desc } from "./order";
export { f, CalculatedConfig, SequenceConfig } from "./utils";

export interface TableOptions<
  F extends TableFields,
  G extends GeneratedTableFields
> {
  generatedFields?: G;
  /**
   * The combination of keys in this list must be unique for all rows in the table.
   *
   * If an insert query every tries to add a row where all of these values match an existing row
   * then the existing row will be updated instead.
   */
  unique?: (keyof F | keyof G)[];
}

export class PostgressDatabase {
  private client: pg.Client;
  private queryQueue: string[] = [];

  constructor(connectionString: string) {
    this.client = new pg.Client({
      connectionString,
      ...(process.env.DATABASE_URL
        ? {
            ssl: {
              rejectUnauthorized: false,
            },
          }
        : {}),
    });
  }

  public query(req: string) {
    return new Promise<pg.QueryResult>((resolve) => {
      this.client.query(req, (error, results) => {
        if (error) {
          console.log(`Query failed: ${req}`);
          console.log(error);
        }
        console.log(req);
        resolve(results);
      });
    });
  }

  public async init() {
    await this.client.connect();

    this.queryQueue.forEach((query) => {
      this.query(query);
    });
  }

  public createTable<F extends TableFields, G extends GeneratedTableFields>(
    name: string,
    fields: F,
    options?: TableOptions<F, G>
  ) {
    const { generatedFields, unique } = options ?? {};
    const tableFields = [
      "(",
      [
        ...(generatedFields
          ? _.toPairs(generatedFields).map(([fieldName, { type, config }]) => {
              const getConfigString = () => {
                if (config instanceof SequenceConfig) {
                  return `IDENTITY\n(${sequenceConfigToString(config)})`;
                }
                if (config instanceof CalculatedConfig) {
                  return `${config.toString()} STORED`;
                }
                return "IDENTITY";
              };

              return `"${fieldName}" ${type} GENERATED ALWAYS AS ${getConfigString()}`;
            })
          : []),
        ..._.toPairs(fields).map(
          ([fieldName, dataType]) => `"${fieldName}" ${dataType.toString()}`
        ),
        ...(unique
          ? [
              `CONSTRAINT "${name}_unique" UNIQUE (${unique
                .map((key) => f(key as string))
                .join(", ")})`,
            ]
          : []),
      ].join(",\n"),
      ")",
    ].join("\n");
    this.queryQueue.push(
      `CREATE TABLE IF NOT EXISTS "${name}" ${tableFields};`
    );
    return new Table(this, name, fields, options);
  }

  public removeTable(name: string) {
    this.queryQueue.push(`DROP TABLE IF EXISTS "${name}";`);
  }
}

export type QueryResult<R> = pg.QueryResult<Partial<TableValues<R>>>;

export class Table<F extends TableFields, G extends GeneratedTableFields> {
  private unique: Required<TableOptions<F, G>>["unique"];

  constructor(
    private database: PostgressDatabase,
    private name: string,
    fields: F,
    options?: TableOptions<F, G>
  ) {
    this.unique = options?.unique ?? [];
  }

  f(name: string | TemplateStringsArray) {
    return new TableField(_.isString(name) ? name : name.raw[0], this.name);
  }

  fl(...nameList: (keyof F | keyof G)[]) {
    return nameList.map((name) => new TableField(String(name), this.name));
  }

  async insert(
    recordList: TableValues<F>[],
    returnFieldList?: (keyof F | keyof G)[]
  ) {
    if (recordList.length === 0) {
      throw Error(
        "Db Util Insert Error: Array of value sets must have at least 1 entry"
      );
    }

    const columns: string[] = [];
    const valueSets: string[] = [];

    // Take the keys from the first set of value sets as the fields being inserted
    const keyList = Object.keys(recordList[0]);
    keyList.forEach((field) => {
      columns.push(`"${field}"`);
    });

    for (const row of recordList) {
      const values: SqlValue[] = [];
      for (const key of keyList) {
        // All objects should have the same list of keys
        // but if one does not, its value for missing keys will be blank
        const value = row[key] ?? "";
        values.push(handleSqlValue(value));
      }
      valueSets.push(`(${values.join(", ")})`);
    }

    const conflictString =
      this.unique.length > 0
        ? ` ON CONFLICT (${this.unique
            .map((key) => f(key as string))
            .join(", ")}) DO UPDATE SET ` +
          keyList.map((field) => `${f(field)}=excluded.${f(field)}`).join(", ")
        : "";

    const returnString = returnFieldList
      ? ` RETURNING ${
          returnFieldList.length > 0
            ? returnFieldList.map((field) => `"${String(field)}"`).join(", ")
            : "*"
        }`
      : "";

    return await this.database.query(
      `INSERT INTO "${this.name}" (${columns.join(
        ", "
      )}) VALUES ${valueSets.join(", ")}${conflictString}${returnString};`
    );
  }

  async update(data: { [field: string]: Expression }, where: Condition) {
    const setStrings: string[] = [];
    for (let column in data) {
      setStrings.push(`"${column}"=${getExpToString(data[column])}`);
    }
    return await this.database.query(
      `UPDATE "${this.name}" SET ${setStrings.join(
        ", "
      )} WHERE ${where.toString()};`
    );
  }

  async select(
    fields: (keyof F | keyof G | SelectExpression | Alias)[],
    ...clauses: Clause[]
  ) {
    const fieldsString =
      fields.length > 0
        ? fields
            .map((field) => {
              if (_.isString(field)) {
                return `"${field}"`;
              }
              return field?.toString() ?? "null";
            })
            .join(", ")
        : "*";

    return (await this.database.query(
      `SELECT ${fieldsString} FROM "${this.name}"${buildClauseString(clauses)};`
    )) as QueryResult<F & G>;
  }

  async selectAll(...clauses: Clause[]) {
    return await this.select([], ...clauses);
  }

  fullJoin(on: Condition): Join {
    return new Join(JoinType.Full, this.name, on);
  }
  leftJoin(on: Condition): Join {
    return new Join(JoinType.Left, this.name, on);
  }
  rightJoin(on: Condition): Join {
    return new Join(JoinType.Right, this.name, on);
  }
  innerJoin(on: Condition): Join {
    return new Join(JoinType.Inner, this.name, on);
  }

  async delete(where?: Condition) {
    return await this.database.query(
      `DELETE FROM "${this.name}"${where ? ` WHERE ${where.toString()}` : ""};`
    );
  }
}
