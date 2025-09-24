export const renameExtension = (filename: string, extension = "jpeg") => {
  const newFilename = filename?.substring(
    0,
    filename?.lastIndexOf(".") > 0 ? filename?.lastIndexOf(".") : filename.length
  );
  return `${newFilename}.${extension}`;
};
