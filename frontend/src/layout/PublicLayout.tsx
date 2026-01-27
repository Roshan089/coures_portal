"use client";

import { APP_CONSTANT } from "@/shared/constants/app";
import { useEffect } from "react";
import Link from "next/link";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.title = APP_CONSTANT.AppClientName;
  }, []);

  return (
    <>
      <header className="sticky top-0 z-10 flex items-center h-14 md:h-16 px-4 md:px-6 bg-white border-b-2 border-black/80">
        <Link href="/" className="font-semibold text-lg text-gray-900">
          {APP_CONSTANT.AppClientName}
        </Link>
      </header>
      <div className="min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-4.5rem)]">
        {children}
      </div>
    </>
  );
}
