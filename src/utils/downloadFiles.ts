import { identifyFilename } from "./identify-file";

export const downloadFiles = async (urls: string[]) => {
  if (!urls) return;
  // for (const url of urls) {
  //   if (url.length === 0) continue;
  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.target = "_blank";
  //   link.download = identifyFilename(url);
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // }
  const downloadPromises = urls.map(async (url) => {
    if (url.length !== 0)
      try {
        const filename = `${identifyFilename(url)}`;
        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.download = filename;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (error) {
        console.error(`Error downloading PDF from ${url}: ${error}`);
      }
  });
  await Promise.all(downloadPromises);
};
