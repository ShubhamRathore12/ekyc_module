export function identifyFile(urlString: string) {
  const url = new URL(urlString);
  const extension = url.pathname.substring(url.pathname.lastIndexOf("."));
  return extension ?? "unknown";
}

export function identifyFilename(urlString: string) {
  const url = new URL(urlString);
  const filename = url.pathname.substring(url.pathname.lastIndexOf("/") + 1);
  return filename ?? "doc.pdf";
}
