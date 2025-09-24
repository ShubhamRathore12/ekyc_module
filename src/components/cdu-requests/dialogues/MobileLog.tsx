import TableSkeleton from "@components/common/skeletons/TableSkeleton";
import DataTable from "@components/lib/DataTable";
import getColumnKeys from "@components/lib/DataTable/utils/getColumnKeys";
import UploadIcon from "@icons/UploadIcon";
import { Box, Button, Dialog, DialogContent, IconButton, Typography } from "@mui/material";
import close from "@public/assets/close.svg";
import exportXLSX from "@utils/exportToXlsx";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { useGetMobileLogQuery } from "services/cdu-requests.service";
import { KYCStatus } from "types/ekyc";

interface IProps {
  open: boolean;
  closeHandle: () => void;
  userCode?: string;
}
const Mobile = ({ closeHandle, open, userCode }: IProps) => {
  const [page, setPage] = React.useState<number>(0);
  const [perPage, setPerPage] = React.useState<number>(10);
  const [count, setCount] = React.useState<number>(0);
  const [totalPages, setTotalPages] = React.useState<number>(0);
  const [filters, setFilters] = React.useState<Record<string, unknown>>({});
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const previousResult = useGetMobileLogQuery(
    {
      page_no: page - 1,
      no_of_records: perPage,
      ...filters,
    },
    { skip: page === 0 }
  );

  const currentResult = useGetMobileLogQuery(
    {
      page_no: page,
      no_of_records: perPage,
      ...filters,
    },
    { skip: totalPages ? page >= totalPages : false }
  );

  const nextResult = useGetMobileLogQuery(
    {
      page_no: page + 1,
      no_of_records: perPage,
      ...filters,
    },
    { skip: totalPages ? page >= totalPages : false }
  );
  //

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
  const columns = getColumnKeys(currentResult?.data?.data?.cdu_requests?.[0]);
  const rows = combined;
  const router = useRouter();
  return (
    <>
      <Box>
        <Dialog
          open={open}
          onClose={closeHandle}
          sx={{
            "&  .MuiPaper-root": {
              maxWidth: "unset",
            },
          }}
        >
          <Button
            onClick={closeHandle}
            sx={{
              position: "absolute",
              right: 10,
              top: 10,
              zIndex: 1,
            }}
          >
            <Image src={close} alt="close" />
          </Button>
          {/* <DialogTitle>Email Log</DialogTitle> */}
          <DialogContent>
            <Box
              sx={{
                bgcolor: "#FFFF",
                p: 4,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="h5">Mobile Log {userCode}</Typography>
                <IconButton
                  onClick={() => {
                    exportXLSX(rows, "exported data");
                  }}
                >
                  <UploadIcon />
                </IconButton>
              </Box>
              <>
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
                          copyFields={[]}
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
              </>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    </>
  );
};

export default Mobile;
