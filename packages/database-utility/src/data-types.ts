import { SqlDataType } from './utils';

export class Varchar implements SqlDataType {
  constructor(private size: number) {}

  toString() {
    return `varchar(${this.size})`;
  }
}

export class Char implements SqlDataType {
  constructor(private size: number) {}

  toString() {
    return `char(${this.size})`;
  }
}

export class Decimal implements SqlDataType {
  constructor(private base: number, private precision: number) {}

  toString() {
    return `decimal(${this.base},${this.precision})`;
  }
}

export const SqlBoolean = new class implements SqlDataType {
  toString() {
    return 'boolean';
  }
}

export const SqlTinyInt = new class implements SqlDataType {
  toString() {
    return 'tinyint';
  }
}

export const SqlSmallInt = new class implements SqlDataType {
  toString() {
    return 'smallint';
  }
}

export const SqlBigInt = new class implements SqlDataType {
  toString() {
    return 'bigint';
  }
}
