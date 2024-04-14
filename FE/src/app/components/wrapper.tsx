"use client";

import { usePathname } from "next/navigation";
import React from "react";
import Navbar from "./navbar";
import Sidebar from "./sidebar";

export default function Wrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/auth")) return <>{children}</>;
  else
    return (
      <>
        <Navbar />
        <div className="h-full w-full flex pt-16">
          <Sidebar />
          <div className="pl-64 h-full flex-1">
            <div className="container py-6 h-full">{children}</div>
          </div>
        </div>
      </>
    );
}
