import { reorderKeys } from "@utils/reorderKeys";
import { useEffect, useState } from "react";

export function useInitialColumns<Data>(data: Data[] | undefined, orderedKeys: string[]) {
  const [initialColumns, setInitialColumns] = useState<{ key: string }[]>([]);

  useEffect(() => {
    if (data?.length) {
      const reordered = reorderKeys(data[0], orderedKeys);
      const array = Object.entries(reordered).map(([key]) => ({ key }));
      setInitialColumns(array);
    }
  }, [data, orderedKeys]);

  return initialColumns;
}
