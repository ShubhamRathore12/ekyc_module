import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { InfoKYCResponse } from "types/ekyc";

export const infoApi = createApi({
  reducerPath: "info",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/ekyc/info" }),
  endpoints: (builder) => ({
    getInfo: builder.query<InfoKYCResponse, void>({
      query: () => ({ url: "" }),
    }),
  }),
});

export const { useGetInfoQuery } = infoApi;
