import React, { useEffect } from "react";
import getColumnKeys from "@components/lib/DataTable/utils/getColumnKeys";
import DataTableV2 from "@components/lib/DataTableV2";
import useClientData from "@components/lib/DataTableV2/hooks/useData";
import { checkFilters } from "@components/lib/DataTableV2/utils/api";
import { useAuth } from "@hooks/useAuth";
import { useInitialColumns } from "@hooks/useInitialColumns";
import SendIcon from "@mui/icons-material/Send";

import { Button, CircularProgress, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { formatDate } from "@utils/formatDate";
import { reorderObject } from "@utils/reorderObject";
import { useGetPaymentQuery, useSendToPaymentMutation } from "services/ekyc.service";
import { GetPaymentRequest, GetPaymnetResponse, orderCvlkraKeys, orderPaymentKeys, PaymentResponse } from "types/ekyc";
import { ReportsTab } from "types/reports";
import handleError from "@utils/handleError";
import toast from "react-hot-toast";

const getDefaultDates = () => {
  const today = new Date();
  const fromDate = new Date();
  fromDate.setFullYear(today.getFullYear() - 2);
  today.setDate(today.getDate() + 1);
  return {
    from_date: String(fromDate),
    to_date: String(today),
  };
};

const PaymentReports = () => {
  const { login } = useAuth();
  const { from_date, to_date } = getDefaultDates();

  const [currentFilters, setCurrentFilters] = React.useState<GetPaymentRequest>({
    page_number: 1,
    no_of_records: 10,
    from_date: formatDate(from_date as string),
    to_date: formatDate(to_date as string),
  });

  const [actualFilters, setActualFilters] = React.useState<GetPaymentRequest>(currentFilters);
  const [hitBottom, setHitBottom] = React.useState(false);
  const [sendToPayment] = useSendToPaymentMutation();
  const { data, isError, isLoading } = useGetPaymentQuery({
    ...actualFilters,
    // page_number: actualFilters.page_number,
    // no_of_records: actualFilters.no_of_records,
    // from_date: formatDate(actualFilters.from_date),
    // to_date: formatDate(actualFilters.to_date),
  }, { refetchOnMountOrArgChange: true });

  const totalPages = data?.data?.no_of_pages || 0;

  const initialColumns = useInitialColumns(data?.data?.scheme_detail, orderPaymentKeys);
  const reorderedObj = reorderObject(data?.data?.scheme_detail?.[0], orderPaymentKeys);
  const isFilters = checkFilters(actualFilters, currentFilters);

  // const fetchPayments = async () => {
  //   await getPayment({
  //   ...actualFilters,
  //   page_number: actualFilters.page_number,
  //   no_of_records: actualFilters.no_of_records,
  //   from_date: formatDate(actualFilters.from_date),
  //   to_date: formatDate(actualFilters.to_date),
  // });
  // };

  // useEffect(() => {
  //   fetchPayments();
  // }, [actualFilters]);

  function handleSubmit() {
    if (isFilters.actualFiltersApplied || isFilters.currentFiltersApplied) {
      setActualFilters((prev) => ({
        ...currentFilters,
        from_date: formatDate(currentFilters.from_date),
        to_date: formatDate(currentFilters.to_date),
        page_number: 1,
      }));
      // fetchPayments();
    }
  }

  const { clientData } = useClientData<
    PaymentResponse,
    "scheme_detail",
    GetPaymnetResponse,
    GetPaymentRequest
  >({
    data: data,
    keyname: "scheme_detail",
    isFilters,
    actualFilters,
    setActualFilters,
    totalPages,
    hitBottom,
    id: "client_id"
  });

  return (
    <>
      <Box sx={{ bgcolor: "#FFFF", p: 2 }}>
        <Typography variant="h5">Payment Report</Typography>

        <Box sx={{ display: "flex", gap: 3, alignItems: "center", flexWrap: "wrap", pt: 2 }}>
          <Stack direction="row" alignItems="center">
            <Typography sx={{ width: "100px" }}>From Date</Typography>
            <DatePicker
              value={currentFilters.from_date}
              inputFormat="dd/MM/yyyy"
              onChange={(newValue) =>
                setCurrentFilters((prev: GetPaymentRequest) => ({ ...prev, from_date: String(newValue) }))
              }
              renderInput={(params) => <TextField fullWidth {...params} />}
            />
          </Stack>

          <Stack direction="row" alignItems="center">
            <Typography sx={{ width: "100px" }}>To Date</Typography>
            <DatePicker
              value={currentFilters.to_date}
              inputFormat="dd/MM/yyyy"
              onChange={(newValue) => setCurrentFilters((prev: GetPaymentRequest) => ({ ...prev, to_date: String(newValue) }))}
              renderInput={(params) => <TextField fullWidth {...params} />}
            />
          </Stack>

          <Button variant="contained" size="large" onClick={handleSubmit}>
            Search
          </Button>

          <Button
            variant="contained"
            size="large"
            onClick={() => {
              setCurrentFilters({
                page_number: 1,
                no_of_records: 10,
                from_date,
                to_date,
              });
              setActualFilters({
                page_number: 1,
                no_of_records: 10,
                from_date: formatDate(from_date),
                to_date: formatDate(to_date),
              });
              // fetchPayments(); // Re-fetch default data
            }}
          >
            Reset Filters
          </Button>
        </Box>
      </Box>

      <Box sx={{ mt: 3 }}>
        <DataTableV2
          totalPages={totalPages}
          columns={getColumnKeys(reorderedObj, login?.data.admin_type as string)}
          // data={data?.data?.scheme_detail || []}
          data={clientData || []}
          actualFilters={actualFilters}
          setActualFilters={setActualFilters}
          labelMap={{
            client_id: "Client ID",
            account_opening_scheme_code: "Account Opening Scheme Code",
            account_opening_scheme_name: "Account Opening Scheme Name",
            brokerage_scheme_code: "Brokerage Scheme Code",
            brokerage_scheme_name: "Brokerage Scheme Name",
            payment_status: "Payment Status",
            promo_code: "Promo Code",
            pan_number: "PAN Number",
            mobile_number: "Mobile Number"
          }}
          dates={["updated_at", "created_at"]}
          id="client_id"
          copyFields={["client_id", "pan_number"]}
          reset={() => {
            setActualFilters({
              page_number: 1,
              no_of_records: 10,
              from_date: formatDate(from_date as any),
              to_date: formatDate(to_date as any),
            });
            setCurrentFilters({
              page_number: 1,
              no_of_records: 10,
              from_date,
              to_date,
            });
            // fetchPayments();
          }}
          isLoading={isLoading}
          isError={isError}
          currentFilters={currentFilters}
          setCurrentFilters={setCurrentFilters}
          initialColumns={initialColumns}
          dataTableOptions={{
            // export: true,
            // reportName: ReportsTab.CVLKRA_REPORT,
            // fromDate: formatDate(currentFilters.from_date),
            // toDate: formatDate(currentFilters.to_date),
          }}
          setHitBottom={setHitBottom}
          customColumns={
            clientData?.length > 0
              ? [
                  {
                    position: "end",
                    label: "Send to Payment",
                    RenderHeadCell: () => <div></div>,
                    RenderBodyCell({ row }: any) {
                      const [isSending, setIsSending] = React.useState(false);
                   
                      if (!row?.client_id || !row?.payment_order_id) return null;
          
                      return (
                        <Button
                          disabled={isSending}
                          fullWidth
                          startIcon={isSending ? <CircularProgress size={20} /> : <SendIcon />}
                          sx={{ color: "primary.main" }}
                          onClick={async () => {
                            setIsSending(true);
                            try {
                              const res = await sendToPayment({
                                client_id: row.client_id,
                                payment_order_id: row.payment_order_id,
                              }).unwrap();
                              toast.success("Payment status updated");
                            } catch (error) {
                              handleError(error);
                            } finally {
                              setIsSending(false);
                            }
                          }}
                        >
                          Send
                        </Button>
                      );
                    },
                  },
                ]
              : []
          }
          
        />
      </Box>
    </>
  );
};

export default PaymentReports;
