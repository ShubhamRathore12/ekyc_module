export function getValueFromEnum<T extends { [index: string]: string }>(
  enumObj: T,
  key: keyof T
): string | undefined {
  if (key)
    if (Object.prototype.hasOwnProperty.call(enumObj, key)) {
      return enumObj[key];
    }
  return undefined;
}
