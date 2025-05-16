import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { PersonalInfo } from "./blog";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:9000/api/v1/auth",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<
      { status: number; message: string; user: PersonalInfo },
      { email: string; password: string }
    >({
      query: (data) => {
        return {
          url: "/signin",
          method: "POST",
          body: data,
        };
      },
    }),
    register: builder.mutation<
      { status: number },
      { email: string; password: string; fullName: string }
    >({
      query: (data) => {
        return {
          url: "/signup",
          method: "POST",
          body: data,
        };
      },
    }),
    getMe: builder.query<
      {
        status: number;
        message: string;
        user: {
          personal_info: PersonalInfo;
        };
      },
      any
    >({
      query: () => {
        return {
          url: "/me",
          method: "GET",
        };
      },
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetMeQuery } = authApi;
