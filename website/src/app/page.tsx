"use client";
import { AppAlert } from "@/components";
import { useRoleRedirect } from "@/hooks";

const Home = () => {
  useRoleRedirect();
  return (
    <div>
      <AppAlert severity="warning">Home page is under construction</AppAlert>
    </div>
  );
};

export default Home;
