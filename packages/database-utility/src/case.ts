import { IfThenStatement } from './conditions';
import { CaseResult, handleSqlValue, TableField } from './utils';

export class CaseStatement<R extends CaseResult> {
  constructor(private ifThens: IfThenStatement<R>[], private elseResult: R | TableField) {
  }

  toString(): string {
    const ifThenString = this.ifThens.map(ifThen => ifThen.toString()).join('\n');

    return `(CASE ${ifThenString} ELSE ${handleSqlValue(this.elseResult)} END)`;
  }
}

export const caseWhen = <R extends CaseResult>(ifThens: IfThenStatement<R>[], elseResult: R | TableField) => {
  return new CaseStatement<R>(ifThens, elseResult);
};