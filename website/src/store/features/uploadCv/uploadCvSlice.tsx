import { uploadCv } from "@/shared/types/uploadCv";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const initialState: uploadCv = {
  applicantId: "",
  jobId: "",
  coverLetter: "",
  resume: "",
};

const uploadCvSlice = createSlice({
  name: "uploadCv",
  initialState,

  reducers: {
    setUploadCv: (state, action: PayloadAction<uploadCv>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setUploadCv } = uploadCvSlice.actions;
export default uploadCvSlice.reducer;
