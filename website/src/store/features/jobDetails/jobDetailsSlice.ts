import { TJobs } from '@/shared/types/jobType'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface JobDetailsState {
  currentJob: TJobs | null
}

const initialState: JobDetailsState = {
  currentJob: null
}

const jobDetailsSlice = createSlice({
  name: 'jobDetails',
  initialState,
  reducers: {
    setCurrentJob: (state, action: PayloadAction<TJobs>) => {
      state.currentJob = action.payload
    },
    clearCurrentJob: (state) => {
      state.currentJob = null
    }
  }
})

export const { setCurrentJob, clearCurrentJob } = jobDetailsSlice.actions
export default jobDetailsSlice.reducer 