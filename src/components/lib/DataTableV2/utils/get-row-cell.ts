import kebabToCapitalize from "@utils/kebabToCapitalize";
import prettyPrintDate from "@utils/prettyPrintDate";

export const getRowCell = (
  row: Record<string, any>,
  key: string,
  noTransform = false,
  valueMap: Record<string, Record<string, unknown>> | undefined,
  dates: string[] | undefined
) => {
  if (valueMap?.[key]) {
    return valueMap[key][row[key]];
  } else if (dates?.some((date) => date === key)) {
    if (key === "date_of_birth") return row[key];
    return prettyPrintDate(row[key]);
  } else {
    return noTransform ? row[key] : kebabToCapitalize(row[key]);
  }
};
