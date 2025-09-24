import { Box, TableCell, TableRow, Typography } from "@mui/material";

interface IProps {
  colSpan: number;
}

const NoData = (props: IProps) => {
  const { colSpan } = props;
  return (
    <TableRow>
      <TableCell sx={{ bgcolor: "white" }} colSpan={colSpan}>
        <Box
          sx={{
            height: "200px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <img src="/assets/nodata.svg" alt="data-not-found" />
          <Typography fontWeight={600} variant="h4" textAlign="center">
            Data Not Found
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default NoData;
