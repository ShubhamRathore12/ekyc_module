declare module "xlsx/xlsx.mjs" {
  declare const utils: {
    json_to_sheet: (data: object[]) => unknown;
    book_new: () => unknown;
    book_append_sheet: (workbook: unknown, worksheet: unknown, fileTitle: string) => void;
  };
  declare const writeFile: (workbook: unknown, filename: string) => void;
}
