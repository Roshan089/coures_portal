import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AboutState {
  description: string;
  imageUrl: string;
  logoUrl: string;
  website: string;
  createdAt: string;
  companyType: string;
  location: string;
}

const initialState: AboutState = {
  description: "",
  imageUrl: "",
  logoUrl: "",
  website: "",
  createdAt: "",
  companyType: "Sole proprietorship", // Default company type
  location: "",
};

const companyAboutSlice = createSlice({
  name: "companyAbout",
  initialState,
  reducers: {
    setAbout: (state, action: PayloadAction<AboutState>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setAbout } = companyAboutSlice.actions;
export default companyAboutSlice.reducer;
