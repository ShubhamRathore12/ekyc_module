import XLSX from "xlsx/xlsx.mjs";

const exportXLSX = (data: object[], fileTitle = "export.csv") => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, fileTitle);

  XLSX.writeFile(workbook, fileTitle + ".xlsb");
};
export default exportXLSX;
