import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { TJobApplication } from "@/shared/types/jobApplications";

interface ApplicantDetailsState {
  selectedApplicant: TJobApplication | null;
}

const initialState: ApplicantDetailsState = {
  selectedApplicant: null,
};

const applicantDetailsSlice = createSlice({
  name: "applicantDetails",
  initialState,
  reducers: {
    setSelectedApplicant: (state, action: PayloadAction<TJobApplication>) => {
      state.selectedApplicant = action.payload;
    },
    clearSelectedApplicant: (state) => {
      state.selectedApplicant = null;
    },
  },
});

export const { setSelectedApplicant, clearSelectedApplicant } =
  applicantDetailsSlice.actions;
export default applicantDetailsSlice.reducer;
