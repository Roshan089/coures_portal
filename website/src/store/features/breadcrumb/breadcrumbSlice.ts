import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SerializableBreadcrumbItem } from "@/hoc/useBreadcrumbs";

interface BreadcrumbState {
  breadcrumbs: SerializableBreadcrumbItem[];
}

const initialState: BreadcrumbState = {
  breadcrumbs: [],
};

const breadcrumbSlice = createSlice({
  name: "breadcrumb",
  initialState,
  reducers: {
    setBreadcrumbs: (
      state,
      action: PayloadAction<SerializableBreadcrumbItem[]>
    ) => {
      state.breadcrumbs = action.payload;
    },
  },
});

export const { setBreadcrumbs } = breadcrumbSlice.actions;
export default breadcrumbSlice.reducer;
