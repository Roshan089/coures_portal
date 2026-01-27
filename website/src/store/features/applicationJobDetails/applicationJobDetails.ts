import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Applicant } from "@/shared/types/applicationType";

interface ApplicantsState {
  applicants: Applicant[];
}

const initialState: ApplicantsState = {
  applicants: [],
};

const applicantsSlice = createSlice({
  name: "applicants",
  initialState,
  reducers: {
    setApplicants(state, action: PayloadAction<Applicant[]>) {
      state.applicants = action.payload;
    },
  },
});

export const { setApplicants } = applicantsSlice.actions;
export default applicantsSlice.reducer;
