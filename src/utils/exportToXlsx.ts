import { utils, writeFile } from "xlsx/xlsx.mjs";

const exportXLSX = (data: object[], fileTitle = "export.csv") => {
  const worksheet = utils.json_to_sheet(data);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, fileTitle);

  writeFile(workbook, fileTitle + ".xlsb");
};
export default exportXLSX;
