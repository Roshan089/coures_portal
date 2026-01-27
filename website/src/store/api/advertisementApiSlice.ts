import { apiSlice } from "./apiSlice";
import { ADS_API_CONSTANT } from "@/shared/constants/api/advertisment";
import { CreateAd } from "@/shared/types/createAds";

export interface Advertisement {
  id: string;
  bannerCode: string;
  bannerName: string;
  bannerDescription: string;
  adsLocationType: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  redirectUrl: string;
  embedCode: string;
}

export const advertisementApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createAd: builder.mutation<Advertisement, CreateAd>({
      query: (credentials) => ({
        url: ADS_API_CONSTANT.ads,
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Advertisement"],
    }),
    getAds: builder.query<Advertisement[], void>({
      query: () => ({
        url: ADS_API_CONSTANT.ads,
        method: "GET",
      }),
      providesTags: ["Advertisement"],
    }),
    getAd: builder.query<Advertisement, string>({
      query: (adId) => ({
        url: ADS_API_CONSTANT.getAdById(adId),
        method: "GET",
      }),
    }),
    updateAd: builder.mutation<
      Advertisement,
      { adId: string; updatedData: Partial<CreateAd> }
    >({
      query: ({ adId, updatedData }) => ({
        url: ADS_API_CONSTANT.updatedAd(adId),
        method: "PATCH",
        body: updatedData,
      }),
      invalidatesTags: ["Advertisement"],
    }),
    deleteAd: builder.mutation<void, string>({
      query: (adId) => ({
        url: ADS_API_CONSTANT.deleteAd(adId),
        method: "DELETE",
      }),
      invalidatesTags: ["Advertisement"],
    }),
  }),
});

// Export hooks for the endpoints
export const {
  useCreateAdMutation,
  useGetAdsQuery,
  useUpdateAdMutation,
  useGetAdQuery,
  useDeleteAdMutation,
} = advertisementApiSlice;

export default advertisementApiSlice;
