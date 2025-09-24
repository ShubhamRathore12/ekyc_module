import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "@utils/baseQuery";
import {
  AccountBrokerageRequest,
  AccountBrokerageResponse,
  AccountOpeningRequest,
  AccountOpeningResponse,
  AssistUserDataRequest,
  AssistUserDataResponse,
  AvailablePromoCodesRequest,
  AvailablePromoCodesResponse,
  BrokerageSchemeListRequest,
  BrokerageSchemeListResponse,
  BrokSchemeDetailsResponse,
  GeneratePromoCodeRequest,
  GeneratePromoCodeResponse,
  GetBackOfficeUccReportRequest,
  GetBackOfficeUccReportResponse,
  GroupListRequest,
  GroupListResponse,
  ProductCodeResponse,
  PromoCodeDetailResponse,
  PromoCodeLinkRequest,
  PromoCodeLinkResponse,
  PromoCodeListRequest,
  PromoCodeListResponse,
  SchemeDetailsResponse,
  SchemeListRequest,
  SchemeListResponse,
  UpdateBrokSchemeRequest,
  UpdateBrokSchemeResponse,
  UpdateSchemeRequest,
  UpdateSchemeResponse,
} from "types/account";

export const accountOpenApi = createApi({
  reducerPath: "account",
  baseQuery: baseQuery(),
  keepUnusedDataFor: 1,
  tagTypes: ["Account"],
  endpoints: (builder) => ({
    // -------------ACCOUNT OPENING-----------
    accountOpening: builder.mutation<AccountOpeningResponse, AccountOpeningRequest>({
      query: (body) => ({
        url: "scheme-master/account-opening-scheme",
        method: "POST",
        body,
        headers: {
          'X-Skip-Sanitization': 'true', // Custom header to skip sanitization
        },
      }),
      invalidatesTags: ["Account"],
    }),

    schemeList: builder.query<SchemeListResponse, SchemeListRequest | void>({
      query: () => ({
        url: "/scheme-master/account-opening-scheme",
        method: "GET",
      }),
      providesTags: ["Account"],
    }),

    schemeDetails: builder.query<SchemeDetailsResponse, string>({
      query: (scheme_code) => ({
        url: `scheme-master/account-opening-scheme/${scheme_code}`,
        method: "GET",
      }),
      providesTags: ["Account"],
    }),

    updateScheme: builder.mutation<UpdateSchemeResponse, UpdateSchemeRequest>({
      query: ({ ...body }) => ({
        url: `scheme-master/account-opening-scheme/${body.scheme_code}`,
        method: "PUT",
        body,
        headers: {
          'X-Skip-Sanitization': 'true', // Custom header to skip sanitization
        },
      }),
      invalidatesTags: ["Account"],
    }),

    // --------------BROKERAGE SCHEME-----------------------

    accountBrokerage: builder.mutation<AccountBrokerageResponse, AccountBrokerageRequest>({
      query: (body) => ({
        url: "scheme-master/account-opening-brokerage-scheme",
        method: "POST",
        body,
        headers: {
          'X-Skip-Sanitization': 'true', // Custom header to skip sanitization
        },
      }),
      invalidatesTags: ["Account"],
    }),

    brokerageSchemeList: builder.query<BrokerageSchemeListResponse, BrokerageSchemeListRequest>({
      query: () => ({
        url: "/scheme-master/account-opening-brokerage-scheme",
        method: "GET",
      }),
      providesTags: ["Account"],
    }),

    brokSchemeDetails: builder.query<BrokSchemeDetailsResponse, string>({
      query: (scheme_code) => ({
        url: `scheme-master/account-opening-brokerage-scheme/${scheme_code}`,
        method: "GET",
      }),
      providesTags: ["Account"],
    }),

    updateBrokScheme: builder.mutation<UpdateBrokSchemeResponse, UpdateBrokSchemeRequest>({
      query: ({ ...body }) => ({
        url: `scheme-master/account-opening-brokerage-scheme/${body.scheme_code}`,
        method: "PUT",
        body,
        headers: {
          'X-Skip-Sanitization': 'true', // Custom header to skip sanitization
        },
      }),
      invalidatesTags: ["Account"],
    }),

    // -----------------PROMO CODE LINK-------------------------

    groupList: builder.query<GroupListResponse, GroupListRequest | void>({
      query: () => ({
        url: "/scheme-master/group-code/list",
        method: "GET",
      }),
      providesTags: ["Account"],
    }),

    promoCodeLink: builder.mutation<PromoCodeLinkResponse, PromoCodeLinkRequest>({
      query: (body) => ({
        url: "scheme-master/promocode/link",
        method: "POST",
        body,
        headers: {
          'X-Skip-Sanitization': 'true', // Custom header to skip sanitization
        },
      }),
      invalidatesTags: ["Account"],
    }),

    promoCodeList: builder.query<PromoCodeListResponse, PromoCodeListRequest | void>({
      query: ({ group, branch, location, product_code } = {} as PromoCodeListRequest) => ({
        url: "/scheme-master/group-code/promocode",
        method: "GET",
        params: {
          group3: group,
          branch: branch,
          location: location,
          product_code: product_code
        },
      }),
      providesTags: ["Account"],
    }),

    productCodeList: builder.query<ProductCodeResponse, void>({
      query: () => ({
        url: "/scheme-master/productcode-list",
        method: "GET",
      }),
      providesTags: ["Account"],
    }),

    // --------------------PROMO CODE GENERATION--------------------

    generatePromoCode: builder.mutation<GeneratePromoCodeResponse, GeneratePromoCodeRequest>({
      query: (body) => ({
        url: "scheme-master/promocode",
        method: "POST",
        body,
        headers: {
          'X-Skip-Sanitization': 'true', // Custom header to skip sanitization
        },
      }),
      invalidatesTags: ["Account"],
    }),

    updatePromoCode: builder.mutation<GeneratePromoCodeResponse, GeneratePromoCodeRequest>({
      query: ({ ...body }) => ({
        url: `scheme-master/promocode/${body.promo_code}`,
        method: "PUT",
        body,
        headers: {
          'X-Skip-Sanitization': 'true', // Custom header to skip sanitization
        },
      }),
      invalidatesTags: ["Account"],
    }),

    availablePromoCodes: builder.query<
      AvailablePromoCodesResponse,
      AvailablePromoCodesRequest | void
    >({
      query: (params) => ({
        url: `/scheme-master/promocode-list`,
        method: "GET",
        params: { ...params },
      }),
      providesTags: ["Account"],
    }),

    promoCodeDetail: builder.query<PromoCodeDetailResponse, string>({
      query: (promo_code) => ({
        url: `scheme-master/promocode/${promo_code}`,
        method: "GET",
      }),
      providesTags: ["Account"],
    }),

    promoCodeCreated: builder.query<PromoCodeDetailResponse, any>({
      query: (params) => ({
        url: "/scheme-master/promocode-list",
        method: "GET",
        params: { ...params },
      }),
      providesTags: ["Account"],
    }),

    // `````````````````````BACKOFFICE ASSIST USER DATA``````````````````

    assistUserData: builder.query<AssistUserDataResponse, AssistUserDataRequest>({
      query: (params) => ({
        url: `talisma/ekyc-assist`,
        params: { ...params },
        method: "GET",
      }),
      providesTags: ["Account"],
    }),

    // ``````````````````BACKOFFICE UCC REPORT `````````

    backofficeUccReport: builder.query<
      GetBackOfficeUccReportResponse,
      GetBackOfficeUccReportRequest
    >({
      query: (params) => ({
        url: `report/ekyc-assist/ucc`,
        params,
      }),
      providesTags: ["Account"],
    }),

    //``````````````````MF BACKOFFICE UCC REPORT `````````
    mfBackofficeUccReport: builder.query<
      GetBackOfficeUccReportResponse,
      GetBackOfficeUccReportRequest
    >({
      query: (params) => ({
        url: `report/ekyc-assist/ucc?referral_code=mf_admin`,
        params,
      }),
      providesTags: ["Account"],
    }),

  }),
});


export const {
  useAccountOpeningMutation,
  useSchemeListQuery,
  useSchemeDetailsQuery,
  useUpdateSchemeMutation,
  useAccountBrokerageMutation,
  useBrokerageSchemeListQuery,
  useBrokSchemeDetailsQuery,
  useUpdateBrokSchemeMutation,
  useProductCodeListQuery,
  useGroupListQuery,
  usePromoCodeLinkMutation,
  usePromoCodeListQuery,
  useGeneratePromoCodeMutation,
  useUpdatePromoCodeMutation,
  useAvailablePromoCodesQuery,
  usePromoCodeDetailQuery,
  usePromoCodeCreatedQuery,
  useAssistUserDataQuery,
  useBackofficeUccReportQuery,
  useMfBackofficeUccReportQuery
} = accountOpenApi;
