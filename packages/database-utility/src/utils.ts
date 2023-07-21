import _ from 'lodash';

export const sanitize = (value: string) => {
  return value
    .replace(/'/g, '\'\'')
    .replace(/\\/g, '\\\\');
};

export interface SqlDataType {
  toString: () => string;
}

export interface TableFields {
  [field: string]: SqlDataType;
}

export type TableValues<F = { [field: string]: null }> = { [fieldName in keyof F]: SqlValue };

export type SqlValue = TableField | string | number | boolean | null;

export const handleSqlValue = (value: SqlValue) => {
  if (value instanceof TableField) return value.toString();
  return _.isString(value) ? `'${sanitize(value)}'` : value;
};

export class TableField {
  constructor(private name: string) {
  }

  toString(): string {
    return `"${this.name}"`;
  }
}

export const f = (name: string | TemplateStringsArray) => {
  return new TableField(_.isString(name) ? name : name.raw[0]);
};

export type CaseResult = number | string;