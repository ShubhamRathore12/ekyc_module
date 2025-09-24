import * as XLSX from "xlsx";

interface Data {
  [key: string]: string;
}

export function exportToExcelSheet(data: Data[], filename: string, sheetname: string) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetname);
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}
