import React, { useEffect, useState } from "react";
import removeDuplicates from "../utils/removeDuplicates";

type ResponseLike<T extends string, D> = {
  message: string;
  status: string;
  data: {
    no_of_pages: number;
    total_no_of_records: number;
  } & {
    [key in T]: D[];
  };
};

type FilterLike = {
  page_number: number;
  no_of_records: number;
};

interface UseDataProps<D, T extends string, U extends ResponseLike<T, D>, V extends FilterLike> {
  data: U | undefined;
  keyname: T;
  isFilters: {
    actualFiltersApplied: boolean;
    currentFiltersApplied: boolean;
  };
  actualFilters: V;
  setActualFilters: React.Dispatch<React.SetStateAction<V>>;
  totalPages: number;
  hitBottom: boolean;
  id?: keyof D;
}

function useClientData<D, T extends string, U extends ResponseLike<T, D>, V extends FilterLike>({
  data,
  keyname,
  isFilters,
  actualFilters,
  setActualFilters,
  totalPages,
  hitBottom,
  id,
}: UseDataProps<D, T, U, V>) {
  const [clientData, setClientData] = useState<D[]>([]);

  useEffect(() => {
    if (data) {
      if (!isFilters.actualFiltersApplied) {
        // console.log({
        //   clientData,
        //   data: data.data[keyname],
        //   removeDuplicates: removeDuplicates(clientData, data.data[keyname]),
        // });
        setClientData((prevData) => {
          return removeDuplicates(data.data[keyname], prevData, id);
        });
      }
      //  else if (data.data.no_of_pages === 1) {
      //   setClientData(data.data[keyname]);
      // }
      else if (data.data.no_of_pages === 1 || !data.data.no_of_pages) {
        setClientData(data.data[keyname]);
      } else if (data.data.no_of_pages > 1) {
        setClientData((prevData) => {
          if (actualFilters.page_number === 1) {
            prevData = [];
          }
          return removeDuplicates(prevData, data.data[keyname], id);
        });
      } else if (data.data.no_of_pages === 0) {
        setClientData([]);
      }
    }
  }, [data, isFilters.actualFiltersApplied, actualFilters.page_number]);

  useEffect(() => {
    if (hitBottom && actualFilters.page_number < totalPages) {
      setActualFilters((prev) => ({
        ...prev,
        page_number: prev.page_number + 1,
      }));
    }
  }, [hitBottom]);

  // Rest of your code

  return {
    clientData,
  };
}

export default useClientData;
