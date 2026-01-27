import { ApplicantProfileState } from "@/shared/types/ApplicantProfileState";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ApplicantProfileState = {
  currentRole: "",
  profileUrl: "",
  backgroundUrl: "",
  biography: "",
  country: "",
  state: "",
  city: "",
  gender: "",
  experiences: [], // Initially no experiences
};
const applicantProfileSlice = createSlice({
  name: "applicantProfile",
  initialState,

  reducers: {
    setApplicantProfile: (
      state,
      action: PayloadAction<ApplicantProfileState>
    ) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setApplicantProfile } = applicantProfileSlice.actions;
export default applicantProfileSlice.reducer;
