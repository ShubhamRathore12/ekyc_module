// Set is fairly recent (2015 feature)
// In case it doesn't work, replace with older JS logic
// Preferrably use a library like Lodash or jQuery
export default function removeDuplicates<T>(first: T[], second: T[]): T[] {
  return [
    ...new Set([...first.map((v) => JSON.stringify(v)), ...second.map((v) => JSON.stringify(v))]),
  ].map((v) => JSON.parse(v));
}

export function removeDuplicatesMultiple<T>(...arr: T[]): T[] {
  return [...new Set([...arr].flatMap((v) => JSON.stringify(v)))]
    .map((v) => JSON.parse(v))
    .flatMap((v) => v);
}
