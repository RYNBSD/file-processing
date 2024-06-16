export type CSVSetCallback<T> = (
  csv: Buffer,
  index: number
) => Promise<T> | T;

export type CSVCustomCallback<T> = (
  csv: Buffer,
  index: number
) => T | Promise<T>;
