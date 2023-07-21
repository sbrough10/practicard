export class Limit {
  constructor(private amount: number) {}

  toString(): string {
    return ` LIMIT ${this.amount}`;
  }
}

export const limit = (amount: number) => {
  return new Limit(amount);
};

export class Offset {
  constructor(private amount: number) {}

  toString(): string {
    return ` OFFSET ${this.amount}`;
  }
}

export const offset = (amount: number) => {
  return new Offset(amount);
}
