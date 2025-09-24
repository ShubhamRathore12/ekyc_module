import _ from "lodash";
export default function removeDuplicates<T>(first: T[], second: T[], id?: keyof T): T[] {
  if (id) return _.unionWith(first, second, (a, b) => _.isEqual(a[id], b[id]));
  return _.unionWith(first, second, (a, b) => _.isEqual(a, b));
}
