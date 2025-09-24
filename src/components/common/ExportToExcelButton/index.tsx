import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Button } from "@mui/material";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";

interface Props<T> {
  rows: T[];
}

const ExportToExcel = <T extends Record<string, string>>({ rows }: Props<T>) => {
  const handleExport = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    const headerRow = worksheet.addRow(rows[0]);
    headerRow.font = { bold: true };
    Object.keys(rows[0]).forEach((key, i) => {
      worksheet.getColumn(i + 1).width = 20;
      const cell = headerRow.getCell(i + 1);
      cell.value = key;
    });

    for (const row of rows) {
      const dataRow = worksheet.addRow(row);
      Object.keys(row).forEach((key, i) => {
        const cell = dataRow.getCell(i + 1);
        cell.value = row[key];
      });
    }

    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer]), "Book.xlsx");
    });
  };

  return (
    <Button variant="outlined" size="large" startIcon={<ExitToAppIcon />} onClick={handleExport}>
      Export
    </Button>
  );
};

export default ExportToExcel;
