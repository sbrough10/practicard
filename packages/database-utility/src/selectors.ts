export abstract class Selector<F> {
  abstract toString(): string;
}

class MinSelector<F> extends Selector<F> {
  constructor(private field: keyof F) {
    super();
  }

  toString(): string {
    return `MIN("${String(this.field)}")`;
  }
}

class MaxSelector<F> extends Selector<F> {
  constructor(private field: keyof F) {
    super();
  }

  toString(): string {
    return `MAX("${String(this.field)}")`;
  }
}

export const min = <F>(field: keyof F): Selector<F> => {
  return new MinSelector<F>(field);
};

export const max = <F>(field: keyof F): Selector<F> => {
  return new MaxSelector<F>(field);
};
