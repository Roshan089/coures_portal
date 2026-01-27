import { StateListResponse } from "@/shared/types/StateType";
import { apiSlice } from "./apiSlice";
import { STATE_API_CONSTANT } from "@/shared/constants/api/utils";
import { CityListResponse } from "@/shared/types/CityType";

export const stateApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStateList: builder.query<StateListResponse, string>({
      query: (countryCode: string) => {
        return {
          url: STATE_API_CONSTANT.getStateList(countryCode),
          method: "GET",
        };
      },
    }),
    getCityList: builder.query<
      CityListResponse,
      { stateCode: string; countryCode: string }
    >({
      query: ({ stateCode, countryCode }) => {
        return {
          url: STATE_API_CONSTANT.getCityList(stateCode, countryCode),
          method: "GET",
        };
      },
    }),
  }),
});

// Export hooks for the endpoints
export const { useGetStateListQuery, useGetCityListQuery } = stateApiSlice;

export default stateApiSlice;
