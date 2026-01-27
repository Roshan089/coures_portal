import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CompanyProfileState {
  name: string;
  description: string;
  website: string;
  companySize: number;
  imageUrl: string;
  logoUrl: string;
  gstNumber?: string;
  companyType: string;
  location: string;
  agreement: boolean;
}

const initialState: CompanyProfileState = {
  name: "",
  description: "",
  website: "",
  companySize: 0,
  imageUrl: "",
  logoUrl: "",
  gstNumber: "",
  companyType: "Sole proprietorship",
  location: "",
  agreement: false,
};

const companyProfileSlice = createSlice({
  name: "companyProfile",
  initialState,

  reducers: {
    setCompanyProfile: (state, action: PayloadAction<CompanyProfileState>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setCompanyProfile } = companyProfileSlice.actions;
export default companyProfileSlice.reducer;
