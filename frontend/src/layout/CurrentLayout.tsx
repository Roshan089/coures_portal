"use client";

import { useIsAuthenticated } from "@/hooks/auth";
import { PrivateLayout } from "./PrivateLayout";
import { PublicLayout } from "./PublicLayout";

export function CurrentLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useIsAuthenticated();
  return isAuthenticated ? (
    <PrivateLayout>{children}</PrivateLayout>
  ) : (
    <PublicLayout>{children}</PublicLayout>
  );
}
