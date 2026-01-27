import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

export function useIsAuthenticated() {
  // Get `isAuthenticated` directly from Redux state
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  return isAuthenticated;
}
