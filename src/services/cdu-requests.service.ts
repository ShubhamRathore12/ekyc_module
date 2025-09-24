import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  GetCDURequests,
  GetCDUResponse,
  GetEmailLogRequest,
  GetEmailLogResponse,
  GetMobileLogRequest,
  GetMobileLogResponse,
} from "types/cdu-requests";

export const cduRequestsApi = createApi({
  reducerPath: "cduRequests",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/cdu-requests" }),
  endpoints: (builder) => ({
    getCDURequests: builder.query<GetCDUResponse, GetCDURequests>({
      query: (params) => ({ url: "", params }),
    }),
    getEmailLog: builder.query<GetEmailLogResponse, GetEmailLogRequest>({
      query: (params) => ({ url: "/email-log", params }),
    }),
    getMobileLog: builder.query<GetMobileLogResponse, GetMobileLogRequest>({
      query: (params) => ({ url: "/mobile-log", params }),
    }),
  }),
});

export const { useGetCDURequestsQuery, useGetEmailLogQuery, useGetMobileLogQuery } = cduRequestsApi;
