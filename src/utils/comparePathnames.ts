export default function comparePathnames(fromPath: string, toPath: string) {
  function removeQuery(path: string) {
    const queryPrefix = path.indexOf("?");
    return queryPrefix !== -1 ? path.substring(0, queryPrefix) : path;
  }
  return removeQuery(fromPath).localeCompare(removeQuery(toPath));
}
