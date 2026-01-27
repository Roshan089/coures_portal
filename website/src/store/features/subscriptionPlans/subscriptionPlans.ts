import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SubscriptionPlan } from "@/shared/types/SubscriptionPlans";

interface SubscriptionPlansState {
  subscriptionPlans: SubscriptionPlan | null;
}

const initialState: SubscriptionPlansState = {
  subscriptionPlans: null,
};

export const subscriptionPlansSlice = createSlice({
  name: "subscriptionPlans",
  initialState,
  reducers: {
    setSubscriptionPlans: (state, action: PayloadAction<SubscriptionPlan>) => {
      state.subscriptionPlans = action.payload;
    },
    clearSubscriptionPlans: (state) => {
      state.subscriptionPlans = null;
    },
  },
});

export const { setSubscriptionPlans, clearSubscriptionPlans } =
  subscriptionPlansSlice.actions;
export default subscriptionPlansSlice.reducer;
