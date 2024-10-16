export function isValidEnumValue<T extends readonly string[]>(value: string, enumArray: T): value is T[number] {
  return (enumArray as readonly string[]).includes(value);
}