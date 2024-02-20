import { Expression, getExpToString } from "./operations";
import { TableField } from "./utils";

export class AggregateFunction {
  constructor(private operator: string, private field: TableField) {}

  toString(): string {
    return `${this.operator}(${this.field.toString()})`;
  }
}
class MinAggregate extends AggregateFunction {
  constructor(field: TableField) {
    super("MIN", field);
  }
}

class MaxAggregate extends AggregateFunction {
  constructor(field: TableField) {
    super("MAX", field);
  }
}

export const min = (field: TableField): MinAggregate => {
  return new MinAggregate(field);
};

export const max = (field: TableField): MaxAggregate => {
  return new MaxAggregate(field);
};

export type SelectExpression = Expression | AggregateFunction;

const getSelectExpToString = (expression: SelectExpression) => {
  if (expression instanceof AggregateFunction) {
    return expression.toString();
  }
  return getExpToString(expression);
};

export class Alias {
  constructor(public expression: SelectExpression, private label: string) {}

  toString(): string {
    return `(${getSelectExpToString(this.expression)}) AS "${this.label}"`;
  }
}

export const alias = (expression: SelectExpression, label: string) => {
  return new Alias(expression, label);
};
