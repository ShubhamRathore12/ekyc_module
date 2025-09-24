// import { createApi } from "@reduxjs/toolkit/query/react";
// import baseQuery from "@utils/baseQuery";
// import {
//   BlockAdminRequest,
//   BlockAdminResponse,
//   ChangePasswordRequest,
//   ChangePasswordResponse,
//   CreateAdminRequest,
//   CreateAdminResponse,
//   GetAdminRequest,
//   GetAdminResponse,
//   NewPasswordRequest,
//   NewPasswordResponse,
// } from "types/admin";

// export const adminApi = createApi({
//   reducerPath: "admin",
//   baseQuery: baseQuery(),
//   tagTypes: ["Admins"],
//   endpoints: (builder) => ({
//     getAdmins: builder.query<GetAdminResponse, GetAdminRequest>({
//       query: (params) => ({ url: "/admin", params, method: "GET" }),
//       providesTags: ["Admins"],
//     }),
//     createAdmin: builder.mutation<CreateAdminResponse, CreateAdminRequest>({
//       query: (body) => ({ url: "/admin", method: "POST", body }),
//       invalidatesTags: ["Admins"],
//     }),
//     newPassword: builder.mutation<NewPasswordResponse, NewPasswordRequest>({
//       query: (body) => ({ url: "/admin/new-password", method: "PUT", body }),
//     }),
//     changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordRequest>({
//       query: (body) => ({ url: "/admin/change-password", method: "PUT", body }),
//     }),
//     blockAdmin: builder.mutation<BlockAdminResponse, BlockAdminRequest>({
//       query: (body) => ({ url: "/admin/block", method: "PUT", body }),
//       invalidatesTags: ["Admins"],
//     }),
//   }),
// });

// export const {
//   useGetAdminsQuery,
//   useBlockAdminMutation,
//   useChangePasswordMutation,
//   useCreateAdminMutation,
//   useNewPasswordMutation,
// } = adminApi;
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "@utils/baseQuery";
import {
  BlockAdminRequest,
  BlockAdminResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  CreateAdminRequest,
  CreateAdminResponse,
  GetAdminRequest,
  GetAdminResponse,
  NewPasswordRequest,
  NewPasswordResponse,
  SearchAdminRequest,
  SearchAdminResponse,
} from "types/admin";

export const adminApi = createApi({
  reducerPath: "admin",
  baseQuery: baseQuery(),
  tagTypes: ["Admins"],
  endpoints: (builder) => ({
    getAdmins: builder.query<GetAdminResponse, GetAdminRequest>({
      query: (params) => ({ url: "/admin", params, method: "GET" }),
      providesTags: ["Admins"],
    }),
    searchAdmins: builder.query<SearchAdminResponse, SearchAdminRequest>({
      query: (params) => ({ url: "/admin/search", params, method: "GET" }),
      providesTags: ["Admins"],
    }),
    createAdmin: builder.mutation<CreateAdminResponse, CreateAdminRequest>({
      query: (body) => ({ url: "/admin", method: "POST", body,   headers: {
        'X-Skip-Sanitization': 'true', // Custom header to skip sanitization
      }, }),
      invalidatesTags: ["Admins"],
    }),
    newPassword: builder.mutation<NewPasswordResponse, NewPasswordRequest>({
      query: (body) => ({ url: "/admin/new-password", method: "PUT", body,   headers: {
        'X-Skip-Sanitization': 'true', // Custom header to skip sanitization
      }, }),
    }),
    changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordRequest>({
      query: (body) => ({ url: "/admin/change-password", method: "PUT", body ,   headers: {
        'X-Skip-Sanitization': 'true', // Custom header to skip sanitization
      },}),
    }),
    blockAdmin: builder.mutation<BlockAdminResponse, BlockAdminRequest>({
      query: (body) => ({ url: "/admin/block", method: "PUT", body ,   headers: {
        'X-Skip-Sanitization': 'true', // Custom header to skip sanitization
      },}),
      invalidatesTags: ["Admins"],
    }),
  }),
});

export const {
  useGetAdminsQuery,
  useSearchAdminsQuery,
  useLazySearchAdminsQuery,
  useBlockAdminMutation,
  useChangePasswordMutation,
  useCreateAdminMutation,
  useNewPasswordMutation,
} = adminApi;