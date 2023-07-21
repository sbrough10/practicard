import { handleSqlValue, SqlValue } from './utils';

export type Expression = SqlValue | Operation;

export const getExpToString = (exp: Expression) => {
  if (exp instanceof Operation) {
    return exp.toString();
  }
  return handleSqlValue(exp);
}

export class Operation {
  constructor(private expA: Expression, private operator: string, private expB: Expression) {
  }

  public toString(): string {
    const expA = getExpToString(this.expA);
    const expB = getExpToString(this.expB);
    return `(${expA} ${this.operator} ${expB})`;
  }
}

export const op = (expA: Expression, operator: string, expB: Expression) => {
  return new Operation(expA, operator, expB);
};
