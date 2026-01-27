import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AgencyProfileState {
  name: string;
  description: string;
  website: string;
  companySize: number;
  imageUrl: string;
  logoUrl: string;
  gstNumber?: string;
//   companyType: string;
  location: string;
  agreement: boolean;
}

const initialState: AgencyProfileState = {
  name: "",
  description: "",
  website: "",
  companySize: 0,
  imageUrl: "",
  logoUrl: "",
  gstNumber: "",
//   companyType: "Sole proprietorship",
  location: "",
  agreement: false,
};

const agencyProfileSlice = createSlice({
  name: "agencyProfile",
  initialState,

  reducers: {
    setAgencyProfile: (state, action: PayloadAction<AgencyProfileState>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setAgencyProfile } = agencyProfileSlice.actions;
export default agencyProfileSlice.reducer;
