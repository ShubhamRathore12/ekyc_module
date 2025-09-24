import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "@utils/baseQuery";
import { convertToFormData } from "@utils/convertToFormData";
import axios from "axios";
import React from "react";
import {
  GetDematAccountDetailsRequest,
  GetDematAccountDetailsResponse,
  GetSchemeDetailsRequest,
  GetSchemeDetailsResponse,
} from "types/admin";
import {
  AddRejectionTemplateRejectionRequest,
  AddRejectionTemplateRejectionResponse,
  BankDetail,
  DeleteRejectionTemplateRejectionResponse,
  DeleteUserRequest,
  DeleteUserResponse,
  GetAgentAccessTokenRequest,
  GetAgentAccessTokenResponse,
  GetAgentEkycRequest,
  GetAgentEkycResponse,
  GetAllEkycStatusRequest,
  GetAllEkycStatusResponse,
  GetBankDetailsRequest,
  GetBankDetailsResponse,
  GetBasicDetailsRequest,
  GetBasicDetailsResponse,
  GetContactDetailsRequest,
  GetContactDetailsResponse,
  GetCVLKRAPasswordResponse,
  GetCvlkraRequest,
  GetCvlkraResponse,
  GetDPIdDetailsRequest,
  GetDPIdDetailsResponse,
  GetEKycCountRequest,
  GetEKycCountResponse,
  GetEkycRequest,
  GetEkycResponse,
  GetEnumsResponse,
  GetESignDetailsRequest,
  GetESignDetailsResponse,
  GetFTMappingReportsRequest,
  GetFTMappingReportsResponse,
  GetMasterReportsRequest,
  GetMasterReportsResponse,
  GetPersonalDetailsEnumsData,
  GetPersonalDetailsEnumsResponse,
  GetPersonalDetailsRequest,
  GetPersonalDetailsResponse,
  GetRejectionTemplateResponse,
  GetSelfieDetailsRequest,
  GetSelfieDetailsResponse,
  GetSignatureDetailsRequest,
  GetSignatureDetailsResponse,
  GetTalismaAccessTokenResponse,
  GetTalismaEkycRequest,
  GetTalismaEkycResponse,
  GetUCCReportsRequest,
  GetUCCReportsResponse,
  GetUserDetailsRequest,
  GetUserDetailsResponse,
  GetWhatsappConfigResponse,
  LockKYCRequest,
  LockKYCResponse,
  SegmentDetailsRequest,
  SegmentDetailsResponse,
  SendToBankOfficeResponse,
  UCCReports,
  UnlockKYCRequest,
  UnlockKYCResponse,
  UpdateBankDetailsRequest,
  UpdateBankDetailsResponse,
  updateCVLKRAConfigRequest,
  updateCVLKRAConfigResponse,
  UpdateESignDetailsRequest,
  UpdateESignDetailsResponse,
  UpdateIDProofRequest,
  UpdateIDProofResponse,
  UpdateMicrRequest,
  UpdateMicrResponse,
  UpdateImageRequest,
  UpdateImageResponse,
  UpdatePanDetailsRequest,
  UpdatePanDetailsResponse,
  UpdatePersonalDetailsRequest,
  UpdatePersonalDetailsResponse,
  UpdateSegmentDetailsRequest,
  UpdateSegmentDetailsResponse,
  UpdateSegmentImageRequest,
  UpdateSegmentImageResponse,
  UpdateSelfieDetailsRequest,
  UpdateSelfieDetailsResponse,
  UpdateSignatureDetailsRequest,
  UpdateSignatureDetailsResponse,
  UpdateUserDetailsRequest,
  UpdateUserDetailsResponse,
  updateWhatsappConfigRequest,
  updateWhatsappConfigResponse,
  GetDematResponse,
  GetDematRequest,
  SendToNSDLRequest,
  GetPaymentRequest,
  GetPaymnetResponse,
  GetVideoReportsResponse,
  GETVIDEOREPORTREQUEST,
  UploadVideoResponse,
  UploadVideoRequest,
  GetSTXProductResponse,
} from "types/ekyc";
import {
  GetNomineeDetailsResponse,
  UpdateNomineeDetailsRequest,
  UpdateNomineeDetailsResponse,
} from "types/nominee";
import { ApplicationStatus, ReportRequest, ReportResponse } from "types/reports";

export const ekycApi = createApi({
  reducerPath: "ekyc",
  baseQuery: baseQuery(),
  keepUnusedDataFor: 1,
  tagTypes: [
    "Enums",
    "Ekyc",
    "Bank",
    "Personal",
    "User",
    "Pan",
    "Selfie",
    "Signature",
    "Segment",
    "Contact",
    "ESign",
    "ESignUpdate",
    "KycCount",
    "backofficeCount",
    "Master",
    "Agent",
    "AccessToken",
    "UCC",
    "CVLKRA",
    "Demat",
    "Whatsapp_config",
    "CVLKRA_Config",
    "Rejection_template",
    "FT_Mapping_Reports",
    "DP_Id_Details",
    "Image",
    "Talisma",
    "Nominee",
    "Payment",
    "Video",
    "STXProducts",
  ],
  // keepUnusedDataFor: 300,
  endpoints: (builder) => ({
    getAllEnums: builder.query<GetEnumsResponse, void>({
      query: () => ({ url: "/ekyc/enums" }),
      providesTags: ["Enums"],
    }),
    getEkyc: builder.query<GetEkycResponse, GetEkycRequest>({
      query: (params) => ({ url: "/ekyc", params }),
      providesTags: ["Ekyc"],
      // transformResponse: (response: GetEkycResponse) => ({
      //   ...response,
      //   data: {
      //     ...response.data,
      //     ekycs: response.data.ekycs.map((ekyc) => {
      //       const { verify_status, ...rest } = ekyc;
      //       return {
      //         verify_status: verify_status === 1 ? "ESignDone" : ("Rejected" as any),
      //         ...rest,
      //       };
      //     }),
      //   },
      // }),
    }),
    getPayment: builder.query<GetPaymnetResponse, GetPaymentRequest>({
      query: (params) => ({
        url: "report/ekyc/payment-report",
        method: "GET",
        // body: {...body, page_number: String(body.page_number), no_of_records: String(body.no_of_records)}
        // params: {...params, page_number: String(params.page_number), no_of_records: String(params.no_of_records)}
        params,
      }),
      providesTags: ["Payment"],
    }),

    getEKYCData: builder.mutation<GetEkycResponse, GetEkycRequest>({
      query: (params) => ({ url: "/ekyc", params, method: "GET" }),
      invalidatesTags: ["Ekyc"],
    }),
    getMasterReports: builder.query<GetMasterReportsResponse, GetMasterReportsRequest>({
      query: (params) => ({ url: `/report/ekyc/master`, params }),
      providesTags: ["Master"],
      transformResponse: (response: GetMasterReportsResponse) => ({
        ...response,
        data: {
          ...response.data,
          ekycs: response.data.ekycs.map((ekyc) => {
            return {
              ...ekyc,
              app_status:
                ekyc.app_stage === "complete" ? ApplicationStatus.COMPLETED : ekyc.app_status,
              app_stage: ekyc.app_stage === "complete" ? "esign" : ekyc.app_stage,
            };
          }),
        },
      }),
    }),
    getUCCReports: builder.query<GetUCCReportsResponse, GetUCCReportsRequest>({
      query: (params) => ({ url: `/report/ekyc/ucc`, params }),
      providesTags: ["UCC"],
      transformResponse: (response: GetUCCReportsResponse) => ({
        ...response,
        data: {
          ...response.data,
          ekycs: response.data.ekycs.map((ekyc) => {
            const { is_kra_verified, ...rest } = ekyc;
            return {
              ...rest,
              verified_by: is_kra_verified ? "KRA Verified" : "Aadhar Verified",
            } as UCCReports;
          }),
        },
      }),
    }),
    getVideoReports: builder.query<GetVideoReportsResponse, GETVIDEOREPORTREQUEST>({
      query: (params) => ({ url: `/ekyc/get-demo-video-info`, params }),
      providesTags: ["Video"],
    }),
    uploadVideo: builder.mutation<UploadVideoResponse, FormData>({
      query: (formData) => ({
        url: "/ekyc/update-demo-video-info",
        method: "POST",
        body: formData, // Send FormData directly as the body
        headers: {
          'X-Skip-Sanitization': 'true', // Custom header to skip sanitization
        },
      }),
      invalidatesTags: ["Video"],
    }),
    uploadVideoStatus: builder.mutation<UploadVideoResponse, UploadVideoRequest>({
      query: ({ ...body }) => ({
        url: "/ekyc/update-demo-video-enable-info",
        method: "POST",
        body: body, // Send FormData directly as the body
        headers: {
          'X-Skip-Sanitization': 'true', // Custom header to skip sanitization
        },
      }),
      invalidatesTags: ["Video"],
    }),
    // uploadVideo: builder.mutation<UploadVideoResponse, UploadVideoRequest>({
    //   query: ({...body}) => ({
    //     url: `/ekyc/update-demo-video-info`,
    //     method: "POST",
    //     body
    //   }),
    //   invalidatesTags: ["Video"],
    // }),
    getUCCEkycReports: builder.mutation<GetUCCReportsResponse, GetUCCReportsRequest>({
      query: (params) => ({ url: `/report/ekyc/ucc`, params, method: "GET" }),
      invalidatesTags: ["UCC"],
      transformResponse: (response: GetUCCReportsResponse) => ({
        ...response,
        data: {
          ...response.data,
          ekycs: response.data.ekycs.map((ekyc) => {
            const { is_kra_verified, ...rest } = ekyc;
            return {
              ...rest,
              verified_by: is_kra_verified ? "KRA Verified" : "Aadhar Verified",
            } as UCCReports;
          }),
        },
      }),
    }),
    getAgentEkyc: builder.query<GetAgentEkycResponse, GetAgentEkycRequest>({
      query: (params) => ({ url: `/agent/ekyc`, params }),
      providesTags: ["Agent"],
    }),
    getAgentEkycData: builder.mutation<GetAgentEkycResponse, GetAgentEkycRequest>({
      query: (params) => ({ url: `/agent/ekyc`, params, method: "GET" }),
      invalidatesTags: ["Agent"],
    }),
    getBankDetails: builder.query<GetBankDetailsResponse, GetBankDetailsRequest>({
      query: ({ client_id }) => ({ url: `/ekyc/${client_id}/bank` }),
      providesTags: ["Bank", "Image"],
      transformResponse: (response: GetBankDetailsResponse) => ({
        ...response,
        data: {
          ...response.data,
          bank_detail: response.data.bank_detail.map(({ account_holder_name, ...rest }) => {
            return {
              ...rest,
            } as BankDetail;
          }),
        },
      }),
    }),
    getAgentAccessToken: builder.mutation<GetAgentAccessTokenResponse, GetAgentAccessTokenRequest>({
      query: ({ client_id }) => ({ url: `/agent/ekyc/${client_id}/access-token`, method: "GET" }),
      invalidatesTags: ["AccessToken"],
    }),
    updateBankDetails: builder.mutation<UpdateBankDetailsResponse, UpdateBankDetailsRequest>({
      query: ({ client_id, ...body }) => ({ url: `/ekyc/${client_id}/bank`, method: "PUT", body ,   headers: {
        'X-Skip-Sanitization': 'true', // Custom header to skip sanitization
      },}),
      invalidatesTags: ["Bank"],
    }),

    getSegmentDetails: builder.query<SegmentDetailsResponse, SegmentDetailsRequest>({
      query: ({ client_id }) => ({ url: `/ekyc/${client_id}/segment` }),
      providesTags: ["Segment", "Image"],
    }),
    updateSegmentDetails: builder.mutation<
      UpdateSegmentDetailsResponse,
      UpdateSegmentDetailsRequest
    >({
      query: ({ client_id, ...body }) => ({
        url: `/ekyc/${client_id}/segment`,
        method: "PUT",
        body,
        headers: {
          'X-Skip-Sanitization': 'true', // Custom header to skip sanitization
        },
      }),
      invalidatesTags: ["Segment"],
    }),

    getBasicDetails: builder.query<GetBasicDetailsResponse, GetBasicDetailsRequest>({
      query: ({ client_id }) => ({ url: `/ekyc/${client_id}/basic-detail` }),
      providesTags: ["Pan", "Image"],
      // transformResponse: (response: GetPanDetailsResponse) => {
      //   const { mother_name, nationality, ...rest } = response.data.pan_detail;
      //   return {
      //     ...response,
      //     data: {
      //       ...response.data,
      //       dropdown_value: response.data.dropdown_value,
      //       pan_detail: {
      //         mother_name: "abc",
      //         nationality: "Indian",
      //         ...rest,
      //       },
      //     },
      //   };
      // },
    }),
    updatePanDetails: builder.mutation<UpdatePanDetailsResponse, UpdatePanDetailsRequest>({
      query: ({ client_id, ...body }) => ({
        url: `/ekyc/${client_id}/basic-detail`,
        method: "PUT",
        body,
        headers: {
          'X-Skip-Sanitization': 'true', // Custom header to skip sanitization
        },
      }),
      invalidatesTags: ["Pan"],
    }),
    getPersonalDetails: builder.query<GetPersonalDetailsResponse, GetPersonalDetailsRequest>({
      query: ({ client_id }) => ({ url: `/ekyc/${client_id}/other-detail` }),
      providesTags: ["Personal", "Image"],
    }),
    getEKycCount: builder.query<GetEKycCountResponse, GetEKycCountRequest>({
      query: (params) => ({ url: `/ekyc/count`, params }),
      providesTags: ["KycCount"],
    }),
    getBackOfficeCount: builder.query<GetEKycCountResponse, GetEKycCountRequest>({
      query: (params) => ({ url: `/talisma/count`, params }),
      providesTags: ["backofficeCount"],
    }),
    updatePersonalDetails: builder.mutation<
      UpdatePersonalDetailsResponse,
      UpdatePersonalDetailsRequest
    >({
      query: ({ client_id, ...body }) => ({
        url: `/ekyc/${client_id}/other-detail`,
        method: "PUT",
        body,
        headers: {
          'X-Skip-Sanitization': 'true', // Custom header to skip sanitization
        },
      }),
      invalidatesTags: ["Personal"],
    }),
    updateESignDetails: builder.mutation<UpdateESignDetailsResponse, UpdateESignDetailsRequest>({
      query: ({ client_id, ...body }) => ({
        url: `/ekyc/${client_id}/esign`,
        method: "PUT",
        body,
        headers: {
          'X-Skip-Sanitization': 'true', // Custom header to skip sanitization
        },
      }),
      invalidatesTags: ["ESign"],
    }),
    getPersonalDetailsEnums: builder.query<GetPersonalDetailsEnumsResponse, void>({
      query: () => ({ url: `/ekyc-enums` }),
    }),
    getSelfieDetails: builder.query<GetSelfieDetailsResponse, GetSelfieDetailsRequest>({
      query: ({ client_id }) => ({ url: `/ekyc/${client_id}/selfie` }),
      providesTags: ["Selfie", "Image"],
    }),
    updateSelfieDetails: builder.mutation<UpdateSelfieDetailsResponse, UpdateSelfieDetailsRequest>({
      query: ({ client_id, ...body }) => ({
        url: `/ekyc/${client_id}/selfie`,
        method: "PUT",
        body,
        headers: {
          'X-Skip-Sanitization': 'true', // Custom header to skip sanitization
        },
      }),
      invalidatesTags: ["Selfie"],
    }),
    getSignatureDetails: builder.query<GetSignatureDetailsResponse, GetSignatureDetailsRequest>({
      query: ({ client_id }) => ({ url: `/ekyc/${client_id}/signature` }),
      providesTags: ["Signature", "Image"],
    }),
    updateSignatureDetails: builder.mutation<
      UpdateSignatureDetailsResponse,
      UpdateSignatureDetailsRequest
    >({
      query: ({ client_id, ...body }) => ({
        url: `/ekyc/${client_id}/signature`,
        method: "PUT",
        body,
        headers: {
          'X-Skip-Sanitization': 'true', // Custom header to skip sanitization
        },
      }),
      invalidatesTags: ["Signature"],
    }),
    getContactDetails: builder.query<GetContactDetailsResponse, GetContactDetailsRequest>({
      query: ({ client_id }) => ({ url: `/ekyc/${client_id}/contact-detail` }),
      providesTags: ["Contact", "Image"],
    }),
    getUserDetails: builder.query<GetUserDetailsResponse, GetUserDetailsRequest>({
      query: ({ client_id }) => ({ url: `/ekyc/${client_id}/user` }),
    }),
    getAllEkycStatus: builder.query<GetAllEkycStatusResponse, GetAllEkycStatusRequest>({
      query: ({ client_id }) => ({ url: `ekyc/${client_id}/status` }),
    }),
    getESignDetails: builder.query<GetESignDetailsResponse, GetESignDetailsRequest>({
      query: ({ client_id }) => ({ url: `/ekyc/${client_id}/esign` }),
      providesTags: ["ESign", "Image"],
    }),
    updateUserDetails: builder.mutation<UpdateUserDetailsResponse, UpdateUserDetailsRequest>({
      query: ({ client_id, ...body }) => ({
        url: `/ekyc/${client_id}/contact-detail`,
        method: "PUT",
        body,
        headers: {
          'X-Skip-Sanitization': 'true', // Custom header to skip sanitization
        },
      }),
      invalidatesTags: ["Contact"],
    }),
    updateUserDetailsDemat: builder.mutation<UpdateUserDetailsResponse, UpdateUserDetailsRequest>({
      query: ({ client_id, ...body }) => ({
        url: `/ekyc/${client_id}/demat-account-detail`,
        method: "PUT",
        body, 
        headers: {
          'X-Skip-Sanitization': 'true', // Custom header to skip sanitization
        },
      }),
      invalidatesTags: ["Demat"],
      

    }),
    lockKYC: builder.mutation<LockKYCResponse, LockKYCRequest>({
      query: ({ client_id }) => ({ url: `ekyc/${client_id}/lock`, method: "POST" }),
    }),
    unlockKYC: builder.mutation<UnlockKYCResponse, UnlockKYCRequest>({
      query: ({ client_id }) => ({ url: `/ekyc/${client_id}/lock`, method: "PUT" }),
    }),
    updateIDProof: builder.mutation<UpdateIDProofResponse, UpdateIDProofRequest>({
      query: ({ client_id, ...body }) => ({
        url: `/ekyc/${client_id}/contact-detail`,
        method: "POST",
        body,
        headers: {
          'X-Skip-Sanitization': 'true', // Custom header to skip sanitization
        },
      }),
    }),
    updateMicr: builder.mutation<UpdateMicrResponse, UpdateMicrRequest>({
      query: ({ client_id, ...body }) => ({
        url: `/ekyc/${client_id}/micr`,
        method: "PUT",
        body,
        headers: {
          'X-Skip-Sanitization': 'true', // Custom header to skip sanitization
        },
      }),
    }),
    updateImage: builder.mutation<UpdateImageResponse, UpdateImageRequest>({
      query: ({ client_id, ...body }) => ({
        url: `/ekyc/${client_id}/image`,
        method: "PUT",
        body: convertToFormData(body),
        headers: {
          'X-Skip-Sanitization': 'true', // Custom header to skip sanitization
        },
      }),
      invalidatesTags: ["Image"],
    }),
    updateSegmentImage: builder.mutation<UpdateSegmentImageResponse, UpdateSegmentImageRequest>({
      query: ({ client_id, ...body }) => ({
        url: `/ekyc/${client_id}/segment`,
        method: "PUT",
        body: convertToFormData(body),
        headers: {
          'X-Skip-Sanitization': 'true', // Custom header to skip sanitization
        },
      }),
      invalidatesTags: ["Segment"],
    }),
    getReport: builder.mutation<ReportResponse, ReportRequest>({
      query: (body) => ({ url: `/report/ekyc/export`, body, method: "POST" ,   headers: {
        'X-Skip-Sanitization': 'true', // Custom header to skip sanitization
      },}),
    }),
    getMasterEKyc: builder.mutation<GetMasterReportsResponse, GetMasterReportsRequest>({
      query: (params) => ({ url: `/report/ekyc/master`, params, method: "GET" }),
      invalidatesTags: ["Master"],
      transformResponse: (response: GetMasterReportsResponse) => ({
        ...response,
        data: {
          ...response.data,
          ekycs: response.data.ekycs.map((ekyc) => {
            return {
              ...ekyc,
              app_status:
                ekyc.app_stage === "complete" ? ApplicationStatus.COMPLETED : ekyc.app_status,
              app_stage: ekyc.app_stage === "complete" ? "esign" : ekyc.app_stage,
            };
          }),
        },
      }),
    }),

    getCVLKRADetails: builder.query<GetCvlkraResponse, GetCvlkraRequest>({
      query: (params) => ({ url: `/report/ekyc/cvlkra`, params, method: "GET" }),
      providesTags: ["CVLKRA"],
    }),
    getDematDetails: builder.query<GetDematResponse, GetDematRequest>({
      query: (params) => ({ url: `/report/ekyc/nsdl`, params, method: "GET" }),
      providesTags: ["Demat"],
    }),
    getWhatsappConfig: builder.query<GetWhatsappConfigResponse, void>({
      query: () => ({ url: "/feature/whatsapp" }),
      providesTags: ["Whatsapp_config"],
    }),
    getCVLKRAConfig: builder.query<GetCVLKRAPasswordResponse, void>({
      query: () => ({ url: "/feature/cvlkra" }),
      providesTags: ["CVLKRA_Config"],
    }),
    updateWhatsappConfig: builder.mutation<
      updateWhatsappConfigResponse,
      updateWhatsappConfigRequest
    >({
      query: (body) => ({ url: "/feature/whatsapp", method: "PUT", body,   headers: {
        'X-Skip-Sanitization': 'true', // Custom header to skip sanitization
      }, }),
      invalidatesTags: ["Whatsapp_config"],
    }),
    updateCVLKRAConfig: builder.mutation<updateCVLKRAConfigResponse, updateCVLKRAConfigRequest>({
      query: (body) => ({ url: "/feature/cvlkra", body, method: "PUT",   headers: {
        'X-Skip-Sanitization': 'true', // Custom header to skip sanitization
      }, }),
      invalidatesTags: ["CVLKRA_Config"],
    }),
    getRejectionTemplate: builder.query<GetRejectionTemplateResponse, void>({
      query: () => ({ url: "/ekyc/rejection-template" }),
      providesTags: ["Rejection_template"],
    }),
    getFTMappingReports: builder.query<GetFTMappingReportsResponse, GetFTMappingReportsRequest>({
      query: (params) => ({ url: "/report/ekyc/mapping-report", params, method: "GET" }),
      providesTags: ["FT_Mapping_Reports"],
    }),
    getDPIdDetails: builder.query<GetDPIdDetailsResponse, GetDPIdDetailsRequest>({
      query: (params) => ({ url: "/report/ekyc/dp-id", params, method: "GET" }),
      providesTags: ["DP_Id_Details"],
    }),
    addRejectionTemplate: builder.mutation<
      AddRejectionTemplateRejectionResponse,
      AddRejectionTemplateRejectionRequest
    >({
      query: (body) => ({ url: `ekyc/rejection-template`, method: "POST", body,   headers: {
        'X-Skip-Sanitization': 'true', // Custom header to skip sanitization
      }, }),
      invalidatesTags: ["Rejection_template"],
    }),
    deleteRejectionTemplate: builder.mutation<
      DeleteRejectionTemplateRejectionResponse,
      { rejection_reason_id: string }
    >({
      query: ({ rejection_reason_id }) => ({
        url: `ekyc/rejection-template/${rejection_reason_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Rejection_template"],
    }),
    deleteUser: builder.mutation<DeleteUserResponse, DeleteUserRequest>({
      query: (body) => ({
        url: `user/delete`,
        method: "DELETE",
        body: body,
      }),
      invalidatesTags: ["User"],
    }),
    sendToBackOffice: builder.mutation<SendToBankOfficeResponse, { client_id: string }>({
      query: ({ client_id }) => ({
        url: `ekyc/backoffice/${client_id}`,
        method: "POST",
      }),
    }),
    sendToPayment: builder.mutation<any, { client_id: string; payment_order_id: string }>({
      query: ({ client_id, payment_order_id }) => ({
        url: `/ekyc/${client_id}/update-payment-status?payment_order_id=${payment_order_id}`,
        method: "PUT",
      }),
    }),
    sendToNsdl: builder.mutation<SendToBankOfficeResponse, SendToNSDLRequest>({
      query: ({ client_id, ...body }) => ({
        url: `/report/ekyc/nsdl/${client_id}`,
        method: "POST",
        body,
        headers: {
          'X-Skip-Sanitization': 'true', // Custom header to skip sanitization
        },
      }),
      invalidatesTags: ["Demat"],
    }),
    getTalismaEkyc: builder.mutation<GetTalismaEkycResponse, GetTalismaEkycRequest>({
      query: (body) => ({ url: `/talisma/ekyc`, method: "POST", body,   headers: {
        'X-Skip-Sanitization': 'true', // Custom header to skip sanitization
      }, }),
      invalidatesTags: ["Talisma"],
    }),
    getTalismaAccessToken: builder.mutation<GetTalismaAccessTokenResponse, { client_id: string }>({
      query: ({ client_id }) => ({
        url: `/talisma/access-token?client_id=${client_id}`,
        method: "GET",
      }),
      invalidatesTags: ["Talisma"],
    }),
    getNomineeDetails: builder.query<GetNomineeDetailsResponse, { client_id: string }>({
      query: ({ client_id }) => ({ url: `/ekyc/${client_id}/nominee-details` }),
      providesTags: ["Nominee"],
    }),
    updateNomineeDetails: builder.mutation<
      UpdateNomineeDetailsResponse,
      UpdateNomineeDetailsRequest
    >({
      query: ({ client_id, ...body }) => ({
        url: `ekyc/${client_id}/nominee-details`,
        method: "PUT",
        body,
        headers: {
          'X-Skip-Sanitization': 'true', // Custom header to skip sanitization
        },
      }),
      invalidatesTags: ["Nominee"],
    }),

    // ````````````FETCH SCHEME DETAILS````````````````

    getSchemeDetails: builder.query<GetSchemeDetailsResponse, GetSchemeDetailsRequest>({
      query: ({ client_id }) => ({ url: `/ekyc/${client_id}/scheme-detail` }),
      providesTags: ["Personal", "Image"],
    }),

    // ``````````````````````FETCH DEMAT ACCOUNT DETAIL`````````````

    getDematAccountDetails: builder.query<
      GetDematAccountDetailsResponse,
      GetDematAccountDetailsRequest
    >({
      query: ({ client_id }) => ({ url: `/ekyc/${client_id}/demat-account-detail` }),
      providesTags: ["Personal", "Image"],
    }),

    // `````````````````````STX PRODUCT API``````````````````
    getSTXProducts: builder.query<GetSTXProductResponse, void>({
      query: () => ({ url: "/ekyc/product" }),
      providesTags: ["STXProducts"],
    }),
  }),
});

export const useGetPersonalDetailsEnums = () => {
  const [enums, setEnums] = React.useState<GetPersonalDetailsEnumsData>();

  React.useEffect(() => {
    axios
      .get("/api/ekyc/enums")
      .then((response) => setEnums(response.data.data))
      .catch(console.error);
  }, []);

  return { data: enums };
};

export const {
  useGetTalismaEkycMutation,
  useGetTalismaAccessTokenMutation,
  useUpdateNomineeDetailsMutation,
  useGetNomineeDetailsQuery,
  useSendToBackOfficeMutation,
  useSendToPaymentMutation,
  useSendToNsdlMutation,
  useGetDPIdDetailsQuery,
  useUpdateSegmentImageMutation,
  useGetFTMappingReportsQuery,
  useDeleteUserMutation,
  useGetRejectionTemplateQuery,
  useAddRejectionTemplateMutation,
  useDeleteRejectionTemplateMutation,
  useGetWhatsappConfigQuery,
  useUpdateWhatsappConfigMutation,
  useUpdateCVLKRAConfigMutation,
  useGetCVLKRAConfigQuery,
  useGetCVLKRADetailsQuery,
  useGetDematDetailsQuery,
  useGetAgentEkycDataMutation,
  useGetEKYCDataMutation,
  useGetUCCEkycReportsMutation,
  useGetMasterEKycMutation,
  useGetAllEkycStatusQuery,
  useUpdateIDProofMutation,
  useUpdateMicrMutation,
  useUpdateImageMutation,
  useGetEkycQuery,
  useGetBankDetailsQuery,
  useGetBasicDetailsQuery,
  useGetPersonalDetailsQuery,
  useGetSelfieDetailsQuery,
  useGetSignatureDetailsQuery,
  useGetUserDetailsQuery,
  useLockKYCMutation,
  useUnlockKYCMutation,
  useUpdateBankDetailsMutation,
  useUpdatePersonalDetailsMutation,
  useUpdateUserDetailsMutation,
  useUpdateUserDetailsDematMutation,
  useGetSegmentDetailsQuery,
  useUpdateSegmentDetailsMutation,
  useUpdatePanDetailsMutation,
  useUpdateSelfieDetailsMutation,
  useUpdateSignatureDetailsMutation,
  useGetAllEnumsQuery,
  useGetContactDetailsQuery,
  useGetESignDetailsQuery,
  useGetEKycCountQuery,
  useGetBackOfficeCountQuery,
  useGetMasterReportsQuery,
  useGetAgentEkycQuery,
  useGetUCCReportsQuery,
  useGetVideoReportsQuery,
  useUploadVideoMutation,
  useUploadVideoStatusMutation,
  useGetAgentAccessTokenMutation,
  useUpdateESignDetailsMutation,
  useGetSchemeDetailsQuery,
  useGetDematAccountDetailsQuery,
  useGetPaymentQuery,
  useGetSTXProductsQuery,
  // useGetPersonalDetailsEnums
} = ekycApi;
