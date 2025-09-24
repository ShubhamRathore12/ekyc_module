export function reorderObject(obj: Record<string, any> | undefined, keys: string[] = []) {
  const reorderedObj: any = {};
  for (const key of keys) {
    if (obj !== null && obj !== undefined && Object.prototype.hasOwnProperty.call(obj, key)) {
      reorderedObj[key] = obj[key];
    }
  }
  return reorderedObj;
}
