// import AuthGuard from "@components/auth/AuthGuard";
// import DashboardLayout from "@components/layouts/DashboardLayout";
// import { Box, Button, Card, Stack, TextField, Typography } from "@mui/material";
// import { NextPage } from "next";
// import React from "react";
// import { useSelector } from "react-redux";
// import {
//   useBackofficeUccReportQuery,
//   useMfBackofficeUccReportQuery,
// } from "services/accountopen.service";
// import { RootState } from "store";
// import DataTableV2 from "@components/lib/DataTableV2";
// import {
//   GetBackOfficeUccReportRequest,
//   GetBackOfficeUccReportResponse,
//   orderedUccKeys,
//   UccReport,
// } from "types/account";
// import { useInitialColumns } from "@hooks/useInitialColumns";
// import { reorderObject } from "@utils/reorderObject";
// import { checkFilters } from "@components/lib/DataTableV2/utils/api";
// import getColumnKeys from "@components/lib/DataTable/utils/getColumnKeys";
// import { KYCStatus } from "types/ekyc";
// import useClientData from "@components/lib/DataTableV2/hooks/useData";
// import { DatePicker } from "@mui/x-date-pickers";
// import { formatDate } from "@utils/formatDate";

// interface ExtendedGetBackOfficeUccReportRequest extends Omit<GetBackOfficeUccReportRequest, 'from_date' | 'to_date'> {
//   from_date?: Date | null | string;
//   to_date?: Date | null | string;
// }

// const initialFilters: ExtendedGetBackOfficeUccReportRequest = {
//   no_of_records: 10,
//   page_number: 1,
// };

// const BackOfficeUccReport: NextPage = () => {
//   const login = useSelector((state: RootState) => state.auth.login);
//   const isMFUser = login?.data?.admin_type === "mf_user";
//   const isSubUser = login?.data?.admin_type === "sub_user";
//   const isSTXUser = login?.data?.admin_type === "stx_user";


//   const [currentFilters, setCurrentFilters] = React.useState<GetBackOfficeUccReportRequest>({
//     page_number: 1,
//     no_of_records: 10,
//   });

//   const [actualFilters, setActualFilters] =
//     React.useState<GetBackOfficeUccReportRequest>(currentFilters);
//   const [hitBottom, setHitBottom] = React.useState(false);


  
// const isAdminTypeAvailable = !!login?.data?.admin_type;

//   const mfQuery = useMfBackofficeUccReportQuery(
//     { ...actualFilters },
//     { refetchOnMountOrArgChange: true,     skip: !isAdminTypeAvailable || !isMFUser , }
//   );

//   const shouldIncludeReferral =
//   login?.data?.admin_type === "sub_user" || login?.data?.admin_type === "stx_user";

// const filters = {
//   ...actualFilters,
//   ...(shouldIncludeReferral && { referral_code: "sub_admin" }),
// };

// const backofficeQuery = useBackofficeUccReportQuery(filters, {
//   refetchOnMountOrArgChange: true,
//   skip: !isAdminTypeAvailable || isMFUser,
// });


//   const data = isMFUser ? mfQuery.data : backofficeQuery.data;
//   const error = isMFUser ? mfQuery.error : backofficeQuery.error;
//   const isAssistLoading = isMFUser ? mfQuery.isLoading : backofficeQuery.isLoading;

//   const totalPages = data?.data?.no_of_pages || 0;

//   const initialColumns = useInitialColumns(data?.data?.ekycs, orderedUccKeys);

//   const reorderedObj = reorderObject(data?.data?.ekycs?.[0], orderedUccKeys);

//   const isFilters = checkFilters(actualFilters, currentFilters);

//   // React.useEffect(() => {
//   //   if (hitBottom && actualFilters.page_number < totalPages) {
//   //     setActualFilters((prev) => ({
//   //       ...prev,
//   //       page_number: prev.page_number + 1,
//   //     }));
//   //   }
//   // }, [hitBottom]);

//   const { clientData } = useClientData<
//     UccReport,
//     "ekycs",
//     GetBackOfficeUccReportResponse,
//     GetBackOfficeUccReportRequest
//   >({
//     data: data,
//     keyname: "ekycs",
//     isFilters,
//     actualFilters,
//     setActualFilters,
//     totalPages,
//     hitBottom,
//     id: "client_id",
//   });

//    function handleSubmit() {
//     if (isFilters.actualFiltersApplied || isFilters.currentFiltersApplied) {
//       const { from_date, to_date, ...rest } = currentFilters;
//       setActualFilters(() => ({
//         ...rest,
//         ...(from_date &&
//           to_date &&
//           from_date !== "Invalid Date" &&
//           to_date !== "Invalid Date" && {
//             from_date: formatDate(from_date),
//             to_date: formatDate(to_date),
//           }),
//         page_number: 1,
//       }));
//     }
//   }

//   return (
//     <>
//       <Card
//         sx={{
//           p: 4,
//           width: "100%",
//           minHeight: "450px",
//           display: "flex",
//           flexDirection: "column",
//           gap: 3,
//         }}
//       >
//         <Typography variant="h6">UCC Report</Typography>
//         {  login?.data?.admin_type === "sub_user" && <Box
//           sx={{
//             display: "flex",
//             gap: 3,
//             alignItems: "center",
//             flexWrap: { xs: "wrap", xl: "nowrap" },
//             pt: 2,
//           }}
//         >
//           <Stack direction="row" alignItems="center">
//             <Typography sx={{ width: "100px" }}>From Date</Typography>
//             <DatePicker
//               value={currentFilters.from_date || null}
//               inputFormat="dd/MM/yyyy"
//               onChange={(newValue) => {
//                 if (newValue && newValue !== "Invalid Date")
//                   setCurrentFilters((prev) => ({
//                     ...prev,
//                     from_date: newValue,
//                   }));
//               }}
//               renderInput={(params) => <TextField fullWidth {...params} />}
//             />
//           </Stack>
//           <Stack direction="row" alignItems="center">
//             <Typography sx={{ width: "100px" }}>To Date</Typography>
//             <DatePicker
//               value={currentFilters.to_date || null}
//               inputFormat="dd/MM/yyyy"
//               onChange={(newValue) => {
//                 if (newValue && newValue !== "Invalid Date")
//                   setCurrentFilters((prev) => ({
//                     ...prev,
//                     to_date: newValue,
//                   }));
//               }}
//               renderInput={(params) => <TextField fullWidth {...params} />}
//             />
//           </Stack>
//           <Button variant="contained" size="large" onClick={handleSubmit}>
//             Search
//           </Button>

//           <Button
//             variant="contained"
//             size="large"
//             onClick={() => {
//               if (isFilters.actualFiltersApplied) {
//                 setCurrentFilters({
//                   page_number: 1,
//                   no_of_records: 10,
//                 });
//                 setActualFilters({
//                   page_number: 1,
//                   no_of_records: 10,
//                 });
//               }
//             }}
//           >
//             Reset Filters
//           </Button>
//         </Box>}
//         <DataTableV2
//           totalPages={totalPages}
//           columns={getColumnKeys(reorderedObj)}
//           // data={data?.data?.ekycs || []}
//           data={clientData || []}
//           actualFilters={actualFilters}
//           setActualFilters={setActualFilters}
//           valueMap={{
//             app_status: KYCStatus,
//             kyc_status: KYCStatus,
//           }}
//           labelMap={{ client_id: "Client ID" }}
//           dates={["esigned_at", "sent_to_backoffice_at", "send_to_easy_invest_at"]}
//           id="client_id"
//           copyFields={["email", "mobile_number", "client_id"]}
//           reset={() => {
//             setActualFilters({
//               page_number: 1,
//               no_of_records: 10,
//             });
//             setCurrentFilters({
//               page_number: 1,
//               no_of_records: 10,
//             });
//           }}
//           isLoading={isAssistLoading}
//           isError={!!error}
//           currentFilters={currentFilters}
//           setCurrentFilters={setCurrentFilters}
//           initialColumns={initialColumns}
//           setHitBottom={setHitBottom}
//         />
//       </Card>
//     </>
//   );
// };

// BackOfficeUccReport.getLayout = (page) => (
//   <DashboardLayout>
//     <AuthGuard>{page}</AuthGuard>
//   </DashboardLayout>
// );

// export default BackOfficeUccReport;

import AuthGuard from "@components/auth/AuthGuard";
import DashboardLayout from "@components/layouts/DashboardLayout";
import { Box, Button, Card, Stack, TextField, Typography } from "@mui/material";
import { NextPage } from "next";
import React from "react";
import { useSelector } from "react-redux";
import {
  useBackofficeUccReportQuery,
  useMfBackofficeUccReportQuery,
} from "services/accountopen.service";
import { RootState } from "store";
import DataTableV2 from "@components/lib/DataTableV2";
import {
  GetBackOfficeUccReportRequest,
  GetBackOfficeUccReportResponse,
  orderedUccKeys,
  UccReport,
} from "types/account";
import { useInitialColumns } from "@hooks/useInitialColumns";
import { reorderObject } from "@utils/reorderObject";
import { checkFilters } from "@components/lib/DataTableV2/utils/api";
import getColumnKeys from "@components/lib/DataTable/utils/getColumnKeys";
import { KYCStatus, STXProductDetail } from "types/ekyc";
import useClientData from "@components/lib/DataTableV2/hooks/useData";
import { DatePicker } from "@mui/x-date-pickers";
import { formatDate } from "@utils/formatDate";
import { ReportsTab } from "types/reports";
import { DownloadOutlined } from "@mui/icons-material";
import { useGetSTXProductsQuery } from "services/ekyc.service";

interface ExtendedGetBackOfficeUccReportRequest extends Omit<GetBackOfficeUccReportRequest, 'from_date' | 'to_date'> {
  from_date?: Date | null | string;
  to_date?: Date | null | string;
}

const initialFilters: ExtendedGetBackOfficeUccReportRequest = {
  no_of_records: 10,
  page_number: 1,
};

const BackOfficeUccReport: NextPage = () => {
  const login = useSelector((state: RootState) => state.auth.login);
  const isMFUser = login?.data?.admin_type === "mf_user";
  const isSubUser = login?.data?.admin_type === "sub_user";
  const isSTXUser = login?.data?.admin_type === "stx_user";

  const [currentFilters, setCurrentFilters] = React.useState<ExtendedGetBackOfficeUccReportRequest>({
    page_number: 1,
    no_of_records: 10,
  });

  const [actualFilters, setActualFilters] =
    React.useState<ExtendedGetBackOfficeUccReportRequest>(currentFilters);
  const [hitBottom, setHitBottom] = React.useState(false);

  const { data: stxProductsData, isLoading: stxProductsLoading,refetch } = useGetSTXProductsQuery();

  React.useEffect(() => {
 
  refetch();
}, [refetch]);

  // Create product options map from STX API response
  const productOptionsMap = React.useMemo(() => {
    if (!stxProductsData?.data?.product_details) {
      return {};
    }

    const options: Record<string, string> = {};
    stxProductsData.data.product_details.forEach((product: STXProductDetail) => {
      options[product.product_code] = product.product_code;
    });
    return options;
  }, [stxProductsData]);

  const isAdminTypeAvailable = !!login?.data?.admin_type;

  const mfQuery = useMfBackofficeUccReportQuery(
    { ...actualFilters },
    { 
      refetchOnMountOrArgChange: true,
      skip: !isAdminTypeAvailable || !isMFUser,
    }
  );

  const shouldIncludeReferral =
    login?.data?.admin_type === "sub_user" || login?.data?.admin_type === "stx_user";

  const filters = {
    ...actualFilters,
    ...(shouldIncludeReferral && { referral_code: "sub_admin" }),
  };

  const backofficeQuery = useBackofficeUccReportQuery(filters, {
    refetchOnMountOrArgChange: true,
    skip: !isAdminTypeAvailable || isMFUser,
  });

  const data = isMFUser ? mfQuery.data : backofficeQuery.data;
  const error = isMFUser ? mfQuery.error : backofficeQuery.error;
  const isAssistLoading = isMFUser ? mfQuery.isLoading : backofficeQuery.isLoading;

  const totalPages = data?.data?.no_of_pages || 0;

  const initialColumns = useInitialColumns(data?.data?.ekycs, orderedUccKeys);

  const reorderedObj = reorderObject(data?.data?.ekycs?.[0], orderedUccKeys);

  const isFilters = checkFilters(actualFilters, currentFilters);

  const { clientData } = useClientData<
    UccReport,
    "ekycs",
    GetBackOfficeUccReportResponse,
    GetBackOfficeUccReportRequest
  >({
    data: data,
    keyname: "ekycs",
    isFilters,
    actualFilters,
    setActualFilters,
    totalPages,
    hitBottom,
    id: "client_id",
  });




  function handleSubmit() {
    if (isFilters.actualFiltersApplied || isFilters.currentFiltersApplied) {
      const { from_date, to_date, ...rest } = currentFilters;
      setActualFilters(() => ({
        ...rest,
        ...(from_date &&
          to_date && {
            from_date: from_date instanceof Date ? formatDate(from_date as any) : from_date,
            to_date: to_date instanceof Date ? formatDate(to_date as any) : to_date,
          }),
        page_number: 1,
      }));
    }
  }

  return (
    <>
      <Card
        sx={{
          p: 4,
          width: "100%",
          minHeight: "450px",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Typography variant="h6">UCC Report</Typography>
       {login?.data?.admin_type && ["sub_user", "mf_user"].includes(login.data.admin_type) && (
          <Box
            sx={{
              display: "flex",
              gap: 3,
              alignItems: "center",
              flexWrap: { xs: "wrap", xl: "nowrap" },
              pt: 2,
            }}
          >
            <Stack direction="row" alignItems="center">
              <Typography sx={{ width: "100px" }}>From Date</Typography>
              <DatePicker
                value={currentFilters.from_date ? new Date(currentFilters.from_date) : null}
                inputFormat="dd/MM/yyyy"
                onChange={(newValue: Date | null) => {
                  setCurrentFilters((prev) => ({
                    ...prev,
                    from_date: newValue,
                  }));
                }}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </Stack>
            <Stack direction="row" alignItems="center">
              <Typography sx={{ width: "100px" }}>To Date</Typography>
              <DatePicker
                value={currentFilters.to_date ? new Date(currentFilters.to_date) : null}
                inputFormat="dd/MM/yyyy"
                onChange={(newValue: Date | null) => {
                  setCurrentFilters((prev) => ({
                    ...prev,
                    to_date: newValue,
                  }));
                }}
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
                if (isFilters.actualFiltersApplied) {
                  setCurrentFilters({
                    page_number: 1,
                    no_of_records: 10,
                  });
                  setActualFilters({
                    page_number: 1,
                    no_of_records: 10,
                  });
                }
              }}
            >
              Reset Filters
            </Button>
          </Box>
        )}
        <DataTableV2
          totalPages={totalPages}
          columns={getColumnKeys(reorderedObj)}
          data={clientData || []}
          actualFilters={actualFilters}
               filterDropdowns={["product_code"]}
          setActualFilters={setActualFilters}
                   dataTableOptions={{
              export: login?.data?.admin_type === "sub_user" || login?.data?.admin_type === "mf_user",
              reportName: ReportsTab.UCC_REPORT,
                  fromDate: currentFilters.from_date ? formatDate(currentFilters.from_date as any) : undefined,
              toDate: currentFilters.to_date ? formatDate(currentFilters.to_date as any) : undefined,
            
            }}
          valueMap={{
            app_status: KYCStatus,
            kyc_status: KYCStatus,
                    product_code: productOptionsMap,
          }}
          labelMap={{ client_id: "Client ID" }}
          dates={["esigned_at", "sent_to_backoffice_at", "send_to_easy_invest_at"]}
          id="client_id"
          copyFields={["email", "mobile_number", "client_id"]}
          reset={() => {
            setActualFilters({
              page_number: 1,
              no_of_records: 10,
            });
            setCurrentFilters({
              page_number: 1,
              no_of_records: 10,
            });
          }}
          isLoading={isAssistLoading}
          isError={!!error}
          currentFilters={currentFilters}
          setCurrentFilters={setCurrentFilters}
          initialColumns={initialColumns}
          setHitBottom={setHitBottom}
          customColumns={
  login?.data?.admin_type === "mf_user" ||   login?.data?.admin_type === "sub_user"
    ? [
        {
          position: "start",
          label: "Download KRA",
          RenderHeadCell: () => {
            return <div></div>;
          },
          RenderBodyCell({ row }) {
            if (row === null) return <DownloadOutlined />;
            return (
              <Button
                disabled={!row?.esigned_pdf_url || row?.esigned_pdf_url.length === 0}
                startIcon={<DownloadOutlined />}
                component="text"
                sx={{ color: "primary.main" }}
                onClick={() => window.open(row?.esigned_pdf_url)}
              >
                KRA PDF
              </Button>
            );
          },
        },
      ]
    : []
}

        />
      </Card>
    </>
  );
};

BackOfficeUccReport.getLayout = (page) => (
  <DashboardLayout>
    <AuthGuard>{page}</AuthGuard>
  </DashboardLayout>
);

export default BackOfficeUccReport;