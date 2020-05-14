export function* iterableArray<T>(array: Array<T>, start: number = 0): IterableIterator<T> {
  let current = start;
  while (true) {
    if (current >= array.length - 1) {
      current = 0;
    } else {
      current++;
    }
    yield array[current];
  }
}
