import {
  CDUSSearchButton,
  CDUStyledFormBox,
} from "@components/cdu-requests/common/CDUStyledComponents";
import CDURequestsDataTable from "@components/cdu-requests/DataTable/CDURequestsDataTable";
import DateComponent from "@components/common/DateComponent/DateComponent";
import FieldsLayout from "@components/common/FieldsLayout";
import TableSkeleton from "@components/common/skeletons/TableSkeleton";
import { rows } from "@components/DataGrid";
import getColumnKeys from "@components/lib/DataTable/utils/getColumnKeys";
import UploadIcon from "@icons/UploadIcon";
import { IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import exportXLSX from "@utils/exportToXlsx";
import { FormikProvider, useFormik } from "formik";
import React from "react";
import { useGetCDURequestsQuery } from "services/cdu-requests.service";
import { KYCStatus } from "types/ekyc";
import * as Yup from "yup";

const CDUBankTab = () => {
  const formik = useFormik({
    initialValues: {
      from_date: "",
      to_date: "",
    },
    validationSchema: Yup.object().shape({
      from_date: Yup.string().required("From Date is required"),
      to_date: Yup.string().required("To Date is required"),
    }),
    onSubmit: (values, helpers) => {
      helpers.setSubmitting(true);
      setTimeout(() => {
        //
        helpers.setSubmitting(false);
      }, 2000);
    },
  });

  // Dashboard
  const [page, setPage] = React.useState<number>(0);
  const [perPage, setPerPage] = React.useState<number>(10);
  const [count, setCount] = React.useState<number>(0);
  const [totalPages, setTotalPages] = React.useState<number>(0);
  const [filters, setFilters] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const previousResult = useGetCDURequestsQuery(
    {
      page_no: page - 1,
      no_of_records: perPage,
      ...filters,
    },
    { skip: page === 0 }
  );

  const currentResult = useGetCDURequestsQuery(
    {
      page_no: page,
      no_of_records: perPage,
      ...filters,
    },
    { skip: totalPages ? page >= totalPages : false }
  );

  const nextResult = useGetCDURequestsQuery(
    {
      page_no: page + 1,
      no_of_records: perPage,
      ...filters,
    },
    { skip: totalPages ? page >= totalPages : false }
  );

  const combined = React.useMemo(() => {
    const arr = new Array(perPage * (page + 1));
    if (previousResult.data) {
      const cdu_requests = previousResult.data.data.cdu_requests;
      arr.splice((page - 1) * perPage, cdu_requests.length, ...cdu_requests);
    }
    if (currentResult.data) {
      const cdu_requests = currentResult.data.data.cdu_requests;
      arr.splice(page * perPage, cdu_requests.length, ...cdu_requests);
    }
    if (nextResult.data) {
      const cdu_requests = nextResult.data.data.cdu_requests;
      arr.splice((page + 1) * perPage, cdu_requests.length, ...cdu_requests);
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
    //
  }, [page]);

  const onPageChange = (newPage: number) => setPage(newPage);

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
  return (
    <FormikProvider value={formik}>
      <Box
        sx={{
          bgcolor: "#FFFF",
          p: { xs: 1, md: 2 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5">Bank Request</Typography>
          <IconButton
            onClick={() => {
              exportXLSX(rows, "exported data");
            }}
          >
            <UploadIcon />
          </IconButton>
        </Box>
        <Box>
          <Box
            sx={{
              width: { xs: "100%", md: "50%", xl: "80%" },
              display: "flex",
              gap: { xs: 0, xl: 5 },
              alignItems: "center",
              flexWrap: { xs: "wrap", xl: "nowrap" },
            }}
          >
            <FieldsLayout>
              <CDUStyledFormBox>
                <Typography sx={{ width: "100px" }}>From Date</Typography>
                <Box sx={{ mt: 2, flexGrow: 1, width: { xs: "100%", sm: "unset" } }}>
                  <DateComponent name="from_date" />
                </Box>
              </CDUStyledFormBox>
            </FieldsLayout>
            <FieldsLayout>
              <CDUStyledFormBox>
                <Typography sx={{ width: "100px" }}>To Date</Typography>
                <Box sx={{ mt: 2, flexGrow: 1, width: { xs: "100%", sm: "unset" } }}>
                  <DateComponent name="to_date" />
                </Box>
              </CDUStyledFormBox>
            </FieldsLayout>
            <CDUSSearchButton variant="contained" size="large">
              Search
            </CDUSSearchButton>
            {/* <Input name="to_date" type="date" label="To Date" /> */}
          </Box>
        </Box>
      </Box>
      <Box sx={{ bgcolor: "#FFFF", mt: 1 }}>
        {loading && (
          <>
            {/* <CircularProgress
                size={55}
                sx={{
                  color: green[500],
                }}
              /> */}
            <TableSkeleton />
          </>
        )}
        {success && (
          <>
            <CDURequestsDataTable
              columns={getColumnKeys(currentResult?.data?.data?.cdu_requests?.[0])}
              rows={combined || []}
              filters={filters}
              setFilters={setFilters}
              valueMap={{
                status: KYCStatus,
              }}
              labelMap={{ client_id: "Client ID" }}
              dates={["requested_on", "verified_on", "rejected_on"]}
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
              showOption={true}
              bank={true}
            />
          </>
        )}
        {/* {!success && !loading && (
          <>
            <Typography>Data Fetched Failed</Typography>
          </>
        )} */}
      </Box>
    </FormikProvider>
  );
};

export default CDUBankTab;
