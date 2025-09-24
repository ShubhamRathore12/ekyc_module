export function reorderKeys(obj?: any, keys?: string[]) {
  const reorderedObj: any = {};
  keys?.forEach((key) => {
    // eslint-disable-next-line no-prototype-builtins
    if (obj?.hasOwnProperty(key)) {
      reorderedObj[key] = obj[key];
    }
  });
  return reorderedObj;
}
