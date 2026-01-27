"use client";
import { useIsAuthenticated } from "@/hooks/auth";
import { FunctionComponent, PropsWithChildren } from "react";
import PrivateLayout from "./PrivateLayout";
import PublicLayout from "./PublicLayout";

/**
 * Returns the current Layout component depending on different circumstances.
 * @layout CurrentLayout
 */
const CurrentLayout: FunctionComponent<PropsWithChildren> = (props) => {
  const isAuthenticated = useIsAuthenticated();

  // Apply role-based routing logic
  return isAuthenticated ? (
    <PrivateLayout {...props} />
  ) : (
    <PublicLayout {...props} />
  );
};
export default CurrentLayout;
