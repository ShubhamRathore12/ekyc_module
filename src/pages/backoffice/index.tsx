/* eslint-disable react-hooks/rules-of-hooks */
import LaunchIcon from "@mui/icons-material/Launch";
import AuthGuard from "@components/auth/AuthGuard";
import DashboardLayout from "@components/layouts/DashboardLayout";
import {
  Button,
  Card,
  CircularProgress,
  IconButton,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { NextPage } from "next";
import React from "react";
import { useSelector } from "react-redux";
import { useAssistUserDataQuery } from "services/accountopen.service";
import { RootState } from "store";
import DataTableV2 from "@components/lib/DataTableV2";
import { ArrowUpward, OpenInNew } from "@mui/icons-material";
import { toast } from "react-hot-toast";

import {
  useGetBackOfficeCountQuery,
  useGetEKycCountQuery,
  useGetEkycQuery,
  useGetSTXProductsQuery,
  useGetTalismaAccessTokenMutation,
} from "services/ekyc.service";
import handleError from "@utils/handleError";
import {
  AssistUserDataAPIRequest,
  AssistUserDataRequest,
  AssistUserDataResponse,
  AssistUserDatum,
  orderedAssistKeys,
} from "types/account";
import { useInitialColumns } from "@hooks/useInitialColumns";
import { reorderObject } from "@utils/reorderObject";
import { checkFilters } from "@components/lib/DataTableV2/utils/api";
import getColumnKeys from "@components/lib/DataTable/utils/getColumnKeys";
import { adminKeys, KYCStatus, ProductCode, STXProductDetail } from "types/ekyc";
import useClientData from "@components/lib/DataTableV2/hooks/useData";
import kebabToCapitalize from "@utils/kebabToCapitalize";
import PendingApllicantAsset from "@public/assets/dashboard/PendingApplicantsAssets.png";
import RejectedApplicantsAsset from "@public/assets/dashboard/RejectedApplicantsAsset.png";
import TotalApplicantsAsset from "@public/assets/dashboard/TotalApplicantsAsset.png";
import VerifiedApplicantsAsset from "@public/assets/dashboard/VerifiedApplicantsAsset.png";
import Grid from "@mui/material/Grid";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { LinkComponent, ShowIcon } from "@components/DataGrid";

const DashboardCard = dynamic(() => import("../../components/Dashboard/DashboardCard"), {
  ssr: false,
});

const BackofficePage: NextPage = () => {
  const [getTalismaAccessToken, { isLoading: isMutationLoading }] =
    useGetTalismaAccessTokenMutation();
  const login = useSelector((state: RootState) => state.auth.login);
  const referral_code = login?.data?.username || "";

  const [currentFilters, setCurrentFilters] = React.useState<AssistUserDataRequest>({
    page_number: 1,
    no_of_records: 50,
  });

  const [actualFilters, setActualFilters] = React.useState<AssistUserDataRequest>(currentFilters);
  const [hitBottom, setHitBottom] = React.useState(false);
  const [period, setPeriod] = React.useState<string>("all");

  const isAllowedUser =
    login?.data?.admin_type === "mf_user" ||
    login?.data?.admin_type === "sub_user" ||
    login?.data?.admin_type === "stx_user";

  // For mf_user and sub_user: use eKYC query
  const filtersWithReferral = {
    ...actualFilters,
    ...(isAllowedUser && {
      referral_code: login?.data?.username,
    }),
  };

  const {
    data: ekycData,
    isError: isEkycError,
    isLoading: isEkycLoading,
    isFetching: isEkycFetching,
    error: ekycError,
  } = useGetEkycQuery(filtersWithReferral, {
    // refetchOnMountOrArgument: true,
    pollingInterval: 300000,
    skip: !isAllowedUser, // Only run for allowed users
  });

  // For regular users: use AssistUserData query
  const {
    data: assistData,
    error: assistError,
    isLoading: isAssistLoading,
  } = useAssistUserDataQuery(
    { referral_code, ...actualFilters },
    {
      skip: isAllowedUser, // Skip for allowed users who use eKYC query
    }
  );

  // Determine which data source to use
  const data = isAllowedUser ? ekycData : assistData;
  const isError = isAllowedUser ? isEkycError : !!assistError;
  const isLoading = isAllowedUser ? isEkycLoading : isAssistLoading;
  const isFetching = isAllowedUser ? isEkycFetching : false;
  const error = isAllowedUser ? ekycError : assistError;

  // Extract the correct data structure
  const tableData = React.useMemo(() => {
    if (!data?.data) return [];

    if (isAllowedUser) {
      // For mf_user and sub_user, data comes from data.data.ekycs
      return data?.data?.ekycs || [];
    } else {
      // For regular users, data comes from data.data.data
      return data?.data?.data || [];
    }
  }, [data, isAllowedUser]);

  const totalPages = data?.data?.no_of_pages || 0;

  // Count query - skip if main query is loading or has error
  const shouldSkipCountQuery = isLoading || isError;
  const {
    data: BackOfficeCountData,
    isLoading: backOfficeCountLoading,
    error: countError,
  } = useGetEKycCountQuery({ time: period, referral_code }, { skip: shouldSkipCountQuery });

  const backOfficeCount = BackOfficeCountData?.data;

  // Use the correct loading state
  const isMainLoading = isLoading || isFetching;

  const initialColumns = useInitialColumns(
    tableData,
    isAllowedUser ? adminKeys : orderedAssistKeys
  );

  const reorderedObj = reorderObject(tableData?.[0], isAllowedUser ? adminKeys : orderedAssistKeys);

  const isFilters = checkFilters(actualFilters, currentFilters);

  const handleButtonClick = async (id: string) => {
    try {
      const res = await getTalismaAccessToken({ client_id: id }).unwrap();
      window.open(res.data.redirect);
    } catch (error) {
      handleError(error);
    }
  };

  const handleChange = (event: SelectChangeEvent) => {
    setPeriod(event.target.value);
  };

  const cards = [
    {
      title: "TOTAL APPLICANTS",
      numberOfApplicants: backOfficeCount?.total_count,
      duration: period === "" ? "Since Last Month" : kebabToCapitalize(period),
      bgColor: "hsla(215, 98%, 56%, 0.38)",
      iconColor: "hsla(215, 74%, 64%, 1)",
      illustration: TotalApplicantsAsset,
    },
    {
      title: "PENDING APPLICANTS",
      numberOfApplicants: backOfficeCount?.total_pending_count,
      duration: period === "" ? "Since Last Month" : kebabToCapitalize(period),
      bgColor: "hsla(45, 100%, 74%, 1)",
      iconColor: "hsla(45, 33%, 45%, 1)",
      illustration: PendingApllicantAsset,
    },
    {
      title: "VERIFIED APPLICANTS",
      numberOfApplicants: backOfficeCount?.total_verified_count,
      duration: period === "" ? "Since Last Month" : kebabToCapitalize(period),
      bgColor: "hsla(160, 68%, 65%, 1)",
      iconColor: "hsla(160, 100%, 34%, 1)",
      illustration: VerifiedApplicantsAsset,
    },
    {
      title: "REJECTED APPLICANTS",
      numberOfApplicants: backOfficeCount?.total_rejected_count,
      duration: period === "" ? "Since Last Month" : kebabToCapitalize(period),
      bgColor: "hsla(350, 100%, 81%, 1)",
      iconColor: "hsla(354, 99%, 68%, 1)",
      illustration: RejectedApplicantsAsset,
    },
  ];

  const dataForClientData = React.useMemo(() => {
    return {
      data: {
        data: tableData,
        no_of_pages: totalPages,
      },
      message: "Success",
      status: true,
    };
  }, [tableData, totalPages]);

  const verifyStatusMap = {
    1: "Esigndone",
    3: "Rejected",
  };
  const { clientData } = useClientData<AssistUserDatum, "data", any, any>({
    data: dataForClientData,
    keyname: "data",
    isFilters,
    actualFilters,
    setActualFilters,
    totalPages,
    hitBottom,
    id: "id",
  });

   const { data: stxProductsData, isLoading: stxProductsLoading } = useGetSTXProductsQuery();
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
  // Use clientData if available, otherwise fall back to tableData
  const finalTableData = React.useMemo(() => {
    // If clientData is filtering out records, use tableData directly
    if (clientData && clientData.length !== tableData.length) {
      return tableData;
    }
    return clientData || tableData;
  }, [clientData, tableData]);

  // Handle loading state
  if (isLoading) {
    return (
      <Card sx={{ p: 4, width: "100%", textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Loading dashboard data...
        </Typography>
      </Card>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <Card sx={{ p: 4, width: "100%", textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Error Loading Data
        </Typography>
        <Typography variant="body2">Failed to load dashboard data. Please try again.</Typography>
      </Card>
    );
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
        <Grid container spacing={2} sx={{ width: "auto" }}>
          {cards.map((item) => {
            return (
              <DashboardCard
                key={item.title}
                {...item}
                loading={backOfficeCountLoading}
                period={period}
                handleChange={handleChange}
              />
            );
          })}
        </Grid>
        <Typography variant="h6">Assist User Dashboard</Typography>
        <DataTableV2
          valueMap={{
            app_status: KYCStatus,
            verify_status: verifyStatusMap,
                product_code: productOptionsMap,

          }}
          data={finalTableData || []}
          reset={() => {
            setActualFilters({
              page_number: 1,
              no_of_records: 50,
            });
            setCurrentFilters({
              page_number: 1,
              no_of_records: 50,
            });
          }}
          setHitBottom={setHitBottom}
          isLoading={isMainLoading}
          isError={isError}
          initialColumns={initialColumns}
          columns={getColumnKeys(reorderedObj)}
          copyFields={["email", "mobile_number"]}
          id="id"
          customColumns={[
            {
              position: "start",
              label: isAllowedUser ? "Show" : "Assist Client",
              RenderHeadCell: () => {
                return <></>;
              },
              RenderBodyCell: ({ row }) => {
                if (isAllowedUser) {
                  if (row?.product_code === "MFCK" || row?.product_code === "SUBKRA") {
                    return null;
                  }
                  if (row === null) {
                    return <ShowIcon />;
                  }
                  return (
                    <LinkComponent
                      id={row.client_id || row.id}
                      full_name={row.full_name}
                      pan_number={row.pan_number}
                      product_code={row.product_code}
                    />
                  );
                } else {
                  return (
                    <Button
                      variant="text"
                      sx={{ color: "primary.main" }}
                      endIcon={<OpenInNew />}
                      disabled={isMutationLoading}
                      onClick={() => handleButtonClick(row.id)}
                    >
                      {isMutationLoading && <CircularProgress size={24} />}
                    </Button>
                  );
                }
              },
            },
          ]}
          filterDropdowns={[ "product_code"]}
          totalPages={totalPages}
          dates={["updated_at", "created_at", "date_of_birth"]}
          currentFilters={currentFilters}
          setCurrentFilters={setCurrentFilters}
          actualFilters={actualFilters}
          setActualFilters={setActualFilters}
        />
      </Card>
    </>
  );
};

BackofficePage.getLayout = (page) => (
  <DashboardLayout>
    <AuthGuard>{page}</AuthGuard>
  </DashboardLayout>
);

export default BackofficePage;
