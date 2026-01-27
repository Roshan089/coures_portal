import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface JobCreateState {
  title: string;
  companyId: string;
  minExperience: number;
  maxExperience: number;
  status: string;
  jobLocation: string;
  jobType: string;
  description: string;
  skillsRequired: string[];
}

const initialState: JobCreateState = {
  title: "",
  companyId: "",
  minExperience: 0,
  maxExperience: 0,
  status: "Active",
  jobLocation: "",
  jobType: "Full Time",
  description: "",
  skillsRequired: [],
};

const jobCreateSlice = createSlice({
  name: "jobCreate",
  initialState,

  reducers: {
    setJobDetails: (state, action: PayloadAction<JobCreateState>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setJobDetails } = jobCreateSlice.actions;
export default jobCreateSlice.reducer;
