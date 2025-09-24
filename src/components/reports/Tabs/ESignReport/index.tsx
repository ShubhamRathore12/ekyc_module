import DateComponent from "@components/common/DateComponent/DateComponent";
import { LinkComponent, rows, ShowIcon } from "@components/DataGrid";
import DataTable from "@components/lib/DataTable";
import useCombined from "@components/lib/DataTable/hooks/useCombined";
import getColumnKeys from "@components/lib/DataTable/utils/getColumnKeys";
import UploadIcon from "@icons/UploadIcon";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import exportXLSX from "@utils/exportToXlsx";
import { FormikProvider, useFormik } from "formik";
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
const ESignReport = () => {
  const formik = useFormik({
    initialValues: {
      from_date: "",
      to_date: "",
    },
    onSubmit: (values, helpers) => {
      helpers.setSubmitting(true);
      setTimeout(() => {
        //
        helpers.setSubmitting(false);
      }, 2000);
    },
  });

  // Dashboard
  // Dashboard
  const [page, setPage] = React.useState<number>(1);
  const [perPage] = React.useState<number>(10);
  const [count, setCount] = React.useState<number>(0);
  const [totalPages, setTotalPages] = React.useState<number>(0);
  const [filters, setFilters] = React.useState<Record<string, unknown>>({});

  // hooks

  const previousResult = useGetEkycQuery(
    {
      page_number: page - 1,
      no_of_records: perPage,
      ...filters,
    },
    { skip: page === 1 }
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

  const { array: combined } = useCombined({
    arrays: [
      previousResult.data?.data?.ekycs || [],
      currentResult.data?.data?.ekycs || [],
      nextResult.data?.data?.ekycs || [],
    ],
    get: (len) => (page >= totalPages ? len : len - 10),
    deps: [previousResult, currentResult, nextResult],
  });

  // effects
  React.useEffect(() => {
    if (currentResult) {
      setTotalPages(currentResult?.data?.data?.no_of_pages || 0);
      setCount(currentResult?.data?.data?.total_no_of_records || 0);
    }
  }, [currentResult]);

  // handlers
  const onPageChange = (newPage: number) => setPage(newPage);
  return (
    <FormikProvider value={formik}>
      <Box
        sx={{
          bgcolor: "#FFFF",
          p: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5">E-Sign Report</Typography>
          <IconButton
            onClick={() => {
              exportXLSX(rows, "exported data");
            }}
          >
            <UploadIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
            // width: { xs: "100%", md: "60%" },
            display: "flex",
            gap: 3,
            alignItems: "center",
            flexWrap: { xs: "wrap", xl: "nowrap" },
            pt: 2,
          }}
        >
          <Stack direction="row" alignItems="center">
            <Typography sx={{ width: "100px", mb: 2 }}>From Date</Typography>
            <DateComponent name="from_date" />
          </Stack>
          <Stack direction="row" alignItems="center">
            <Typography sx={{ width: "100px", mb: 2 }}>To Date</Typography>
            <DateComponent name="to_date" />
          </Stack>
          <Button variant="contained" size="large" sx={{ mb: 3 }}>
            Search
          </Button>
          {/* <Input name="to_date" type="date" label="To Date" /> */}
        </Box>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Box>
          <DataTable
            copyFields={[]}
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
            hide={["status"]}
            pagination={{
              page,
              perPage,
              count,
              totalPages,
              onPageChange,
            }}
            customColumns={[
              {
                position: "start",
                label: "Show",
                RenderCell({ row }) {
                  if (row === null) return <ShowIcon />;
                  return <LinkComponent id={row.client_id} />;
                },
              },
            ]}
            showExport={true}
          />
        </Box>
      </Box>
    </FormikProvider>
  );
};

export default ESignReport;
