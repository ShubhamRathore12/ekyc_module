export default function convertDate(d: Date, t = true) {
  if (!d) return;
  const utcDate = new Date(d.getTime() + d.getTimezoneOffset() * 60000);
  const date = [
    utcDate.getFullYear(),
    ("0" + (utcDate.getMonth() + 1)).slice(-2),
    ("0" + utcDate.getDate()).slice(-2),
  ].join("-");

  if (!t) {
    return date;
  }

  const time = [
    ("0" + utcDate.getHours()).slice(-2),
    ("0" + utcDate.getMinutes()).slice(-2),
    ("0" + utcDate.getSeconds()).slice(-2),
  ].join(":");

  return [date, time].join(" ");
}
