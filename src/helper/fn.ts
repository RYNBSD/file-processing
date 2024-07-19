export function isArrayOfBuffer(array: unknown[]): array is Buffer[] {
  if (!Array.isArray(array)) return false;
  for (const arr of array) if (!Buffer.isBuffer(arr)) return false;
  return true;
}

export function isArrayOfString(array: unknown[]): array is string[] {
  if (!Array.isArray(array)) return false;
  for (const arr of array) if (typeof arr !== "string") return false;
  return true;
}

export function isUrl(value: unknown): value is URL {
  if (typeof value !== "string") return false;

  try {
    new URL(value);
    return true;
  } catch (error) {
    return false;
  }
}
