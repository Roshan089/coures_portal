"use client"; // Mark this as a Client Component

import { useAppStore } from "@/store/hooks";
import React from "react";
import { Provider } from "react-redux";
// import store from "@/lib/store";

interface ClientProvidersProps {
  children: React.ReactNode;
}

const ClientProviders: React.FC<ClientProvidersProps> = ({ children }) => {
  const store = useAppStore();
  return <Provider store={store}>{children}</Provider>;
};

export default ClientProviders;
