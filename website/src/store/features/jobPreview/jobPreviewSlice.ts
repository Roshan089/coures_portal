import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { jobDetailsFormValues } from '../../../yup/jobDetailSchema'

interface JobPreviewState {
  jobData: jobDetailsFormValues | null
}

const initialState: JobPreviewState = {
  jobData: null
}

const jobPreviewSlice = createSlice({
  name: 'jobPreview',
  initialState,
  reducers: {
    setJobPreview: (state, action: PayloadAction<jobDetailsFormValues>) => {
      state.jobData = action.payload
    },
    clearJobPreview: (state) => {
      state.jobData = null
    }
  }
})

export const { setJobPreview, clearJobPreview } = jobPreviewSlice.actions
export default jobPreviewSlice.reducer 