import React from "react";
import {
  Skeleton,
  Box,
  TableContainer,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Table,
} from "@mui/material";
const TableSkeleton = () => {
  const columnHeadings = new Array(8).fill(0);
  const columns = new Array(8).fill(0);
  const rows = new Array(8).fill(0);

  return (
    <Box sx={{ bgcolor: "#FFFF", mt: 2, pt: 4, width: "100%" }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {rows.map((i) => {
                return (
                  <TableCell key={i}>
                    <Skeleton
                      sx={{ borderRadius: 10 }}
                      variant="rectangular"
                      width={150}
                      height={30}
                    />
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {columns.map((i) => {
              return (
                <TableRow key={i}>
                  {rows.map((j) => {
                    return (
                      <TableCell key={j}>
                        <Skeleton
                          sx={{ borderRadius: 10 }}
                          variant="rectangular"
                          width={150}
                          height={30}
                        />
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TableSkeleton;

// return <Skeleton variant="rectangular" width={210} height={118} />;
