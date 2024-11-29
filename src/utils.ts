export function hasValue<T>(arg: T): arg is NonNullable<T> {
  return arg !== undefined && arg !== null;
}

export function noValue(arg: unknown): arg is undefined | null {
  return !hasValue(arg);
}

export function repeat<T>(parse: () => T | undefined): T[] {
  const nodes: T[] = [];
  for (;;) {
    const node = parse();
    if (hasValue(node)) {
      nodes.push(node);
    } else {
      return nodes;
    }
  }
}
