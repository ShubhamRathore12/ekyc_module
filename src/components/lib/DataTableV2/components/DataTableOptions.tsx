import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useConfig } from "../hooks/config";
import trimObject from "../utils/trimObject";
import DataTableOptionsModal from "./DataTableOptionsModal";

import ExportButton from "@components/common/ExportButton";
import ExportToExcel from "@components/common/ExportToExcelButton";
import {
  Button,
  Stack,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import kebabToCapitalize from "@utils/kebabToCapitalize";
import React from "react";
import { ReportRequest } from "types/reports";
import { getRowCell } from "../utils/get-row-cell";
interface DataTableOptionsProps<T> {
  columns: { key: string }[];
  dates?: string[];
  valueMap?: Record<string, Record<string, unknown>>;
  data: T[];
  filters: T;
  reset: () => void;
  colSpan?: number;
  showExport?: boolean;
  dataTableOptions?: {
    export?: boolean;
    localExport?: boolean;
  } & Partial<ReportRequest>;
  hide?: string[];
  labelMap?: Record<string, string>;
}

const DataTableOptions = <T extends Record<string, any>>({
  filters,
  reset,
  colSpan,
  data,
  columns,
  dates,
  valueMap,
  dataTableOptions,
  hide,
  labelMap,
}: DataTableOptionsProps<T>) => {
  const { config, setConfig } = useConfig();

  const [open, setOpen] = React.useState(false);
  function handleOpen() {
    setOpen(true);
  }
  function handleClose() {
    setOpen(false);
  }

  const exportedRows = data.map((row) => {
    return columns.reduce((obj, cur) => {
      return {
        ...obj,
        [labelMap?.[cur.key] || kebabToCapitalize(cur.key)]:
          (getRowCell(row, cur.key, false, valueMap, dates) as string) ?? "",
      };
    }, {});
  });

  return (
    <>
      <DataTableOptionsModal open={open} onClose={handleClose} columns={columns} hide={hide} />
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell colSpan={colSpan} sx={{ minHeight: "0px" }}>
                <Stack direction="row" gap={2}>
                  {dataTableOptions && exportedRows.length > 0 && (
                    <Stack>
                      {dataTableOptions.export &&
                        (dataTableOptions.reportName ? (
                          <ExportButton
                            reportName={dataTableOptions.reportName}
                            fromDate={dataTableOptions.fromDate || ""}
                            toDate={dataTableOptions.toDate || ""}
                          />
                        ) : dataTableOptions.localExport ? (
                          <ExportToExcel rows={exportedRows} />
                        ) : null)}
                    </Stack>
                  )}
                  {filters &&
                    Object?.keys(trimObject(filters || {})).filter(
                      (key) => key !== "page_number" && key !== "no_of_records"
                    ).length > 0 && (
                      <Button
                        size="large"
                        startIcon={<FilterAltIcon />}
                        variant="outlined"
                        onClick={() => {
                          reset();
                        }}
                        sx={{ alignItems: "center" }}
                      >
                        Reset Filters
                      </Button>
                    )}
                  <Button variant="outlined" onClick={handleOpen}>
                    Settings
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
    </>
  );
};

export default DataTableOptions;
