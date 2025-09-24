export default function convertPANDate(date: string, reverse?: boolean): string {
  if (!reverse) {
    const [day, month, year] = date.split("/");
    return [year, month, day].join("/");
  } else {
    const [year, month, day] = date.split("/");
    return [day, month, year].join("/");
  }
}
