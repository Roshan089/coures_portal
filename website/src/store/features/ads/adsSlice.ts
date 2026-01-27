import { CreateAd } from "@/shared/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: CreateAd = {
  bannerName: "",
  bannerCode: "",
  bannerDescription: "",
  bannerStartDate: new Date().toISOString().slice(0, 16), // Current datetime (ISO format)
  bannerEndDate: new Date().toISOString().slice(0, 16), // Current datetime
  bannerImage: "",
  location: "",
  redirectionLink: "",
  embedCodeSnippet: "",
};

const adsSlice = createSlice({
  name: "applicantProfile",
  initialState,

  reducers: {
    createAds: (state, action: PayloadAction<CreateAd>) => {
      return { ...state, ...action.payload };
    },
    updateAd: (state, action: PayloadAction<CreateAd>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { createAds } = adsSlice.actions;
export default adsSlice.reducer;
