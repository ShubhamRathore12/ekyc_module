export function identifyFileName(url: string) {
  const fileName = url.substring(url.lastIndexOf("/") + 1);
  return fileName ?? "unknown";
}
