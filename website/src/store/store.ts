import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import { apiSlice } from "./api/apiSlice";
import companyProfileReducer from "./features/CompanyProfile/CompanyProfileSlice";
import jobCreateReducer from "./features/companyJobCreateSlice/companyJobCreateSlice";
import applicantsReducer from "@/store/features/applicationJobDetails/applicationJobDetails";
import jobDetailsReducer from "./features/jobDetails/jobDetailsSlice";
import jobPreviewReducer from "./features/jobPreview/jobPreviewSlice";
import applicantDetailsReducer from "./features/applicantDetails/applicantDetailsSlice";
import subscriptionPlansReducer from "./features/subscriptionPlans/subscriptionPlans";
import breadcrumbReducer from "./features/breadcrumb/breadcrumbSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
      auth: authReducer,
      companyProfile: companyProfileReducer,
      jobCreate: jobCreateReducer,
      applicants: applicantsReducer,
      jobDetails: jobDetailsReducer,
      jobPreview: jobPreviewReducer,
      applicantDetails: applicantDetailsReducer,
      subscriptionPlans: subscriptionPlansReducer,
      breadcrumb: breadcrumbReducer,
    },

    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),

    devTools: process.env.NEXT_PUBLIC_NODE_ENV === "development",
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
