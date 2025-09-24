import { DependencyList, useEffect, useState } from "react";
import removeDuplicates from "../utils/removeDuplicates";

interface Params<T> {
  arrays: T[][];
  deps: DependencyList;
  reset?: boolean;
  get?: (len: number) => number;
}

interface Return<T> {
  array: T[];
}

export default function useCombined<T = unknown>(params: Params<T>): Return<T> {
  const { arrays, deps, reset, get } = params;
  const [array, setArray] = useState<T[]>([]);

  useEffect(() => {
    setArray((previous) => {
      const base = reset ? [] : previous;
      const combined = arrays.reduce((base, current) => {
        return base.concat(current);
      }, []);
      return removeDuplicates(base, combined);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps]);

  return { array };
  // return { array: array.slice(0, get?.(array.length)) };
}
