import TableSkeleton from "@components/common/skeletons/TableSkeleton";
import { rows } from "@components/DataGrid";
import DataTable from "@components/lib/DataTable";
import getColumnKeys from "@components/lib/DataTable/utils/getColumnKeys";
import UploadIcon from "@icons/UploadIcon";
import { Box, IconButton, Typography } from "@mui/material";
import exportXLSX from "@utils/exportToXlsx";
import DashboardLayout from "components/layouts/DashboardLayout";
import { NextPage } from "next";
import React from "react";
import { useGetEkycQuery } from "services/ekyc.service";
import {
  AOCPlanType,
  ApplicationType,
  KYCStatus,
  PromoCode,
  ReferralCode,
  Scheme,
} from "types/ekyc";

const DDPIReports: NextPage = () => {
  // Dashboard
  const [page, setPage] = React.useState<number>(0);
  const [perPage, setPerPage] = React.useState<number>(10);
  const [count, setCount] = React.useState<number>(0);
  const [totalPages, setTotalPages] = React.useState<number>(0);
  const [filters, setFilters] = React.useState<Record<string, unknown>>({});
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const previousResult = useGetEkycQuery(
    {
      page_number: page - 1,
      no_of_records: perPage,
      ...filters,
    },
    { skip: page === 0 }
  );

  const currentResult = useGetEkycQuery(
    {
      page_number: page,
      no_of_records: perPage,
      ...filters,
    },
    { skip: totalPages ? page >= totalPages : false }
  );

  const nextResult = useGetEkycQuery(
    {
      page_number: page + 1,
      no_of_records: perPage,
      ...filters,
    },
    { skip: totalPages ? page >= totalPages : false }
  );

  const combined = React.useMemo(() => {
    const arr = new Array(perPage * (page + 1));
    if (previousResult.data) {
      const ekycs = previousResult.data.data.ekycs;
      arr.splice((page - 1) * perPage, ekycs.length, ...ekycs);
    }
    if (currentResult.data) {
      const ekycs = currentResult.data.data.ekycs;
      arr.splice(page * perPage, ekycs.length, ...ekycs);
    }
    if (nextResult.data) {
      const ekycs = nextResult.data.data.ekycs;
      arr.splice((page + 1) * perPage, ekycs.length, ...ekycs);
    }
    return arr;
  }, [perPage, page, filters, previousResult.data, currentResult.data, nextResult.data]);

  React.useEffect(() => {
    if (currentResult) {
      setTotalPages(currentResult?.data?.data?.no_of_pages || 0);
      setCount(currentResult?.data?.data?.total_no_of_records || 0);
    }
  }, [currentResult]);

  React.useEffect(() => {
    if (previousResult.isLoading || currentResult.isLoading || nextResult.isLoading) {
      setLoading(true);
      setSuccess(false);
    }

    if (previousResult.isSuccess || currentResult.isSuccess || nextResult.isSuccess) {
      setLoading(false);
      setSuccess(true);
    }
    if (previousResult.isError || currentResult.isError || nextResult.isError) {
      setLoading(false);
      setSuccess(false);
    }
  }, [
    currentResult.isError,
    currentResult.isLoading,
    currentResult.isSuccess,
    nextResult.isError,
    nextResult.isLoading,
    nextResult.isSuccess,
    previousResult.isError,
    previousResult.isLoading,
    previousResult.isSuccess,
  ]);
  const onPageChange = (newPage: number) => setPage(newPage);

  return (
    <Box sx={{ gap: 4, p: 3 }}>
      <Box
        sx={{
          bgcolor: "white",
          p: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontWeight: 500 }} variant="h5" component="p">
            DDPI Requests
          </Typography>
          <IconButton
            onClick={() => {
              exportXLSX(rows, "exported data");
            }}
          >
            <UploadIcon />
          </IconButton>
        </Box>
      </Box>
      <Box
        sx={{
          mt: 1,
          bgcolor: "white",
          height: "100%",
        }}
      >
        <Box style={{ width: "100%" }}>
          {loading ? (
            <>
              {/* <CircularProgress
                size={55}
                sx={{
                  color: green[500],
                }}
              /> */}
              <TableSkeleton />
            </>
          ) : (
            <>
              {success && (
                <>
                  <DataTable
                    columns={getColumnKeys(currentResult?.data?.data?.ekycs?.[0])}
                    rows={combined || []}
                    filters={filters}
                    setFilters={setFilters}
                    valueMap={{
                      status: KYCStatus,
                      application_type: ApplicationType,
                      promo_code: PromoCode,
                      scheme: Scheme,
                      referral_code: ReferralCode,
                      aoc_plan_type: AOCPlanType,
                    }}
                    labelMap={{ client_id: "Client ID" }}
                    dates={["updated_at", "created_at", "date_of_birth"]}
                    id="client_id"
                    // hide={["status"]}
                    pagination={{
                      page,
                      perPage,
                      count,
                      totalPages,
                      onPageChange,
                    }}
                    showExport={true}
                  />
                </>
              )}
              {/* {!success && !loading && (
                <>
                  <Typography>Data Fetched Failed</Typography>
                </>
              )} */}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

DDPIReports.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default DDPIReports;
