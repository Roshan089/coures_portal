import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

console.log("env", process.env.NEXT_PUBLIC_API_BASE_URL);

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,

  prepareHeaders: (headers) => {
    const token = localStorage.getItem("currentUser")
      ? JSON.parse(localStorage.getItem("currentUser") || "{}")?.accessToken
      : null;
    console.log("token auth", token);

    if (token) {
      headers.set("Authorization", token);
    }

    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["Jobs"],
  endpoints: () => ({}),
});
