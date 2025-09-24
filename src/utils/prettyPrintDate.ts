export default function prettyPrintDate(date: string | Date, hideTime?: boolean) {
  // checking for invalid date
  if (!date) return "--";
  const d = new Date(date);

  /*
   * we do not want to proceed if d is "Invalid Date"
   * if d is "Invalid Date" then getTime() will return NaN
   * NaN is the only type in javascript which isn't strictly equal to itself
   * so the following condition will be true if d is "Invalid Date"
   */
  // eslint-disable-next-line no-self-compare
  if (d.getTime() !== d.getTime()) return "--";

  // formatting the date according to Indian date format
  const formatter = Intl.DateTimeFormat("en-IN", {
    dateStyle: "short",
    ...(!hideTime ? { timeStyle: "short" } : {}),
  });
  return formatter.format(d).toUpperCase();
}
