import * as pg from 'pg';
import _ from 'lodash';
import { handleSqlValue, SqlValue, TableFields, TableValues } from './utils';
import { Limit, Offset } from './clauses';
import { Condition } from './conditions';
import { Order } from './order'
import { Selector } from './selectors';

export * from './data-types';
export { caseWhen } from './case';
export type { Limit, Offset } from './clauses';
export { limit, offset } from './clauses';
export * from './conditions';
export { op } from './oprations';
export type { Order, SortExpression } from './order';
export { asc, desc } from './order'
export type { Selector } from './selectors';
export { min, max } from './selectors';
export { f } from './utils';

export interface TableOptions {

}

enum TableAction {
  Create = 'create',
  Remove = 'remove',
}

interface QueuedTable {
  action: TableAction;
  name: string;
  fields?: TableFields;
  options?: TableOptions;
}

export class PostgressDatabase {
  private client: pg.Client;
  private tableQueue: QueuedTable[] = [];

  constructor(connectionString: string) {
    this.client = new pg.Client({
      connectionString,
      ...( process.env.DATABASE_URL
        ? {
          ssl: {
            rejectUnauthorized: false,
          }
        } : {}
      )
    });
  }

  public query(req: string) {
    return new Promise<pg.QueryResult>(resolve => {
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

    this.tableQueue.forEach((table) => {
      switch (table.action) {
        case TableAction.Create: {
          const tableFields = `(\n${
            _.toPairs(table.fields).map(
              ([fieldName, dataType]) => `"${fieldName}" ${dataType.toString()}`
            ).join(',\n')
          }\n)`;
          this.query(`CREATE TABLE IF NOT EXISTS "${table.name}" ${tableFields};`);
          break;
        }
        case TableAction.Remove: {
          this.query(`DROP TABLE IF EXISTS "${table.name}";`);
          break;
        }
      }
    });
  }

  public createTable<F extends TableFields>(name: string, fields: F, options?: TableOptions) {
    this.tableQueue.push({
      action: TableAction.Create,
      name,
      fields,
      options,
    });
    return new Table(this, name, fields, options);
  }

  public removeTable(name: string) {
    this.tableQueue.push({
      action: TableAction.Remove,
      name,
    });
  }
}

export type QueryResult<R> = pg.QueryResult<Partial<TableValues<R>>>;

type Clause = Order | Condition | Limit | Offset;

const buildClauseString = (clauses: Clause[]): string => {
  let where = '';
  const orders: string[] = [];
  let endString = '';

  clauses.forEach(clause => {
    if (clause instanceof Condition) {
      const condition = clause.toString();
      if (condition.length > 0) {
        where = ` WHERE ${condition}`;
      }
    } else if (clause instanceof Order) {
      orders.push(clause.toString());
    } else {
      endString += clause.toString();
    }
  });

  if (orders.length > 0) {
    endString = ` ORDER BY ${orders.join(', ')}` + endString;
  }

  return where + endString;
};

export class Table<F extends TableFields> {
  constructor(private database: PostgressDatabase, private name: string, fields: F, options?: TableOptions) {
  }

  async insert(...data: TableValues<F>[]) {
    if (data.length === 0) {
      throw Error('Db Util Insert Error: Array of value sets must have at least 1 entry');
    }

    const columns: string[] = [];
    const valueSets: string[] = [];

    // Take the keys from the first set of value sets as the fields being inserted
    Object.keys(data[0]).forEach(field => {
      columns.push(`"${field}"`);
    });

    for (const row of data) {
      const values: SqlValue[] = [];
      for (const column in row) {
        const value = row[column];
        values.push(handleSqlValue(value));
      }
      valueSets.push(`(${values.join(', ')})`);
    }

    return await this.database.query(
      `INSERT INTO "${this.name}" (${columns.join(', ')}) VALUES ${valueSets.join(', ')};`
    );
  }

  async update(data: Partial<TableValues<F>>, where: Condition) {
    const setStrings: string[] = [];
    for (let column in data) {
      setStrings.push(`"${column}"=${handleSqlValue(data[column])}`);
    }
    return await this.database.query(
      `UPDATE "${this.name}" SET ${setStrings.join(', ')} WHERE ${where.toString()};`
    );
  }

  async select(fields: (keyof F | Selector<F>)[], ...clauses: Clause[]) {
    const fieldsString = fields ? fields.map(field => {
      if (_.isString(field)) {
        return `"${field}"`;
      }
      // Assume it is a Selector
      return (field as Selector<F>).toString();
    }).join(', ') : '*';

    return await this.database.query(
      `SELECT ${fieldsString} FROM "${this.name}"${buildClauseString(clauses)};`
    ) as QueryResult<F>;
  }

  async selectAll(...clauses: Clause[]) {
    return await this.database.query(
      `SELECT * FROM "${this.name}"${buildClauseString(clauses)};`
    ) as QueryResult<F>;
  }

  async delete(where?: Condition) {
    return await this.database.query(`DELETE FROM "${this.name}"${where ? ` WHERE ${where.toString()}` : ''};`);
  }
}
