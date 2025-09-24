import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import { ReportRequest } from "types/reports";
import DataTableOptions from "./components/DataTableOptions";
import NoData from "./components/NoData";
import { TableBodyCell } from "./components/TableBodyCell";
import { TableColumnCell } from "./components/TableColumnCell";
import { ConfigProvider } from "./contexts/config";
import { useConfig } from "./hooks/config";
import removeDuplicates from "./utils/removeDuplicates";

export interface Props<T, U> {
  columns: { key: string }[];
  data: Record<string, any>[];
  currentFilters: U;
  totalPages: number;
  setCurrentFilters: React.Dispatch<React.SetStateAction<U>>;
  actualFilters: U;
  setActualFilters: React.Dispatch<React.SetStateAction<U>>;
  setHitBottom: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  isError: boolean;
  initialColumns: { key: string }[];
  id: string;
  reset: () => void;
  dates?: string[];
  filterDropdowns?: string[];
  valueMap?: Record<string, Record<string, unknown>>;
  labelMap?: Record<string, string>;
  copyFields?: string[];
  dataTableOptions?: {
    export?: boolean;
    localExport?: boolean;
    fontIncrease?: boolean;
    fontDecrease?: boolean;
    dense?: boolean;
  } & Partial<ReportRequest>;
  hideFilters?: boolean;
  customColumns?:
    | {
        position: "start" | "end";
        label: string;
        RenderHeadCell: React.FC;
        RenderBodyCell: React.FC<{ row: T }>;
      }[];
  hide?: string[];
  editableColumns?: string[];
}

const DataTableV2 = <
  T extends Record<string, any>,
  U extends { page_number: number; no_of_records: number }
>({
  id = "id",
  isError,
  isLoading,
  initialColumns,
  columns,
  setHitBottom,
  actualFilters,
  currentFilters,
  setCurrentFilters,
  setActualFilters,
  data,
  filterDropdowns,
  dates,
  copyFields,
  valueMap,
  reset,
  dataTableOptions,
  hideFilters = false,
  totalPages,
  customColumns,
  hide,
  labelMap,
  editableColumns,
}: Props<T, U>) => {
  const rowRef = React.useRef<HTMLTableRowElement>(null);
  const dataTable = React.createRef<HTMLTableElement>();

  const [scrolling, setScrolling] = React.useState(false);

  const { config, setConfig } = useConfig();

  // React.useEffect(() => {
  //   const tableEl = dataTable.current;
  //   const lastRow = dataTable.current?.querySelector("tbody")?.lastElementChild;

  //   if (tableEl && lastRow) {
  //     const observer = new IntersectionObserver(
  //       ([entry]) => {
  //         if (setHitBottom) {
  //           if (entry.isIntersecting && actualFilters.page_number < totalPages) {
  //             setHitBottom(true);
  //             setScrolling(true);
  //           } else {
  //             setScrolling(false);
  //             setHitBottom(false);
  //             setScrolling(false);
  //           }
  //         }
  //       },
  //       { root: tableEl }
  //     );
  //     observer.observe(lastRow);
  //     return () => observer.unobserve(lastRow);
  //   }
  // }, [data]);

  React.useEffect(() => {
    if (hide) {
      if (hide.length > 0) {
        setConfig((prev) => ({
          ...prev,
          hide: hide,
        }));
      }
    }
  }, [hide]);

  const onScroll = () => {
    const tableEl = dataTable.current;
    const lastRow = dataTable.current?.querySelector("tbody")?.lastElementChild;
    if (tableEl && lastRow) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (setHitBottom) {
            if (entry.isIntersecting && actualFilters.page_number < totalPages) {
              setHitBottom(true);
              setScrolling(true);
              observer.unobserve(lastRow);
            } else {
              setHitBottom(false);
              setScrolling(false);
              observer.unobserve(lastRow);
            }
          }
        },
        { root: tableEl }
      );
      observer.observe(lastRow);
    }
  };

  const frozenKeys = config.frozenKeys;
  const maxStickyColumns = config.maxStickyColumns;
  const positions = config.positions;
  const configHidden = config.hide;

  const frozen = {
    left: frozenKeys?.filter((k) => k.pos === "left"),
    right: frozenKeys?.filter((k) => k.pos === "right").reverse(),
  };

  const position = {
    left: positions?.filter((k) => k.pos === "left"),
    right: positions?.filter((k) => k.pos === "right"),
  };

  const custom = {
    start: customColumns?.filter((col) => col.position === "start"),
    end: customColumns?.filter((col) => col.position === "end"),
  };

  let filteredColumns = removeDuplicates(frozen.left, position.left)
    .concat(
      custom?.start?.map((col) => ({
        key: col.label,
        pos: col.position === "start" ? ("left" as const) : ("right" as const),
        ...col,
      })) || []
    )
    .concat(
      columns
        .filter((col) => !positions?.some((key) => col.key === key.key))
        .filter((col) => !frozenKeys?.some((key) => col.key === key.key))
        .concat(custom.end?.map((col) => ({ key: col.label, pos: col.position, ...col })) || [])
        .concat(removeDuplicates(position.right, frozen.right))
    )
    .filter((col) => !configHidden.some((key) => col.key === key))
    .filter((col) => !hide?.some((key) => col.key === key));

  if (filteredColumns.length === customColumns?.length || filteredColumns.length === 0)
    filteredColumns = initialColumns;

  const dataTableOptionsColumns = columns.filter((col) => !hide?.some((key) => col.key === key));

  return (
    <Box sx={{ bgcolor: "#FFFF" }}>
      {data?.length > 0 && (
        <DataTableOptions
          filters={actualFilters}
          reset={reset}
          colSpan={data?.[0]?.length}
          columns={dataTableOptionsColumns}
          data={data}
          valueMap={valueMap}
          dates={dates}
          labelMap={labelMap}
          dataTableOptions={dataTableOptions}
        />
      )}
      <TableContainer ref={dataTable} sx={{ maxHeight: 456 }} onScroll={onScroll}>
        <Table size="medium" stickyHeader>
          <TableHead>
            <TableRow>
              {filteredColumns?.map((column) => (
                <TableColumnCell
                  key={`${column.key}`}
                  column={column}
                  currentFilters={currentFilters}
                  actualFilters={actualFilters}
                  setCurrentFilters={setCurrentFilters}
                  setActualFilters={setActualFilters}
                  dates={dates}
                  filterDropdowns={filterDropdowns}
                  hideFilters={hideFilters}
                  valueMap={valueMap}
                  labelMap={labelMap}
                />
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isError ? (
              <TableRow>
                <TableCell
                  align="center"
                  colSpan={initialColumns?.length + (customColumns ? customColumns.length : 0)}
                >
                  <Typography>Something went wrong</Typography>
                </TableCell>
              </TableRow>
            ) : isLoading ? (
              <TableRow>
                <TableCell
                  align="center"
                  colSpan={initialColumns?.length + (customColumns ? customColumns.length : 0)}
                >
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : data?.length > 0 ? (
              data?.map((row) => (
                <TableRow key={row[id]} ref={rowRef}>
                  {filteredColumns?.map((column) => {
                    const isValueCopyField = copyFields?.includes(column.key);
                    return (
                      <TableBodyCell
                        key={`${column.key}.${row[id]}`}
                        column={column}
                        dates={dates || []}
                        row={row}
                        isCopyField={isValueCopyField}
                        valueMap={valueMap || undefined}
                        frozenKeys={frozenKeys}
                        maxStickyColumns={maxStickyColumns}
                        editableColumns={editableColumns}
                      />
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <NoData colSpan={initialColumns?.length} />
            )}
            {scrolling && data.length > 0 && (
              <TableRow>
                <TableCell align="center" colSpan={initialColumns?.length}>
                {isLoading  && <CircularProgress />}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default function DataTableWrapper<
  T extends Record<string, any>,
  U extends { page_number: number; no_of_records: number }
>(props: Props<T, U>) {
  return (
    <ConfigProvider>
      <DataTableV2 {...props} />
    </ConfigProvider>
  );
}
