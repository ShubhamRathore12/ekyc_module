/**
 * Formats the date as per the format accepted by our BE
 * @param date Date object or string
 * @param rev boolean to reverse
 * @returns string representing the date
 */
export function formatDate(date?: string | null, rev = false): string {
  let res = "";
  if (date) {
    if (rev) {
      const [year, month, day] = date.toString().split("-");
      const d = new Date(+year, +month - 1, +day);
      return d.toString();
    } else {
      const d = new Date(date);
      const day = d.getDate();
      const month = d.getMonth();
      const year = d.getFullYear();
      const values = [year, `0${month + 1}`.slice(-2), `0${day}`.slice(-2)];
      res = values.join("-");
    }
  }

  return res;
}
