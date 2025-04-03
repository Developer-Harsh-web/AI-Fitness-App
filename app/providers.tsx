"use client";

import { SessionProvider } from "next-auth/react";
import { UserContextProvider } from "../lib/hooks/UserContext";
import React from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <UserContextProvider>{children}</UserContextProvider>
    </SessionProvider>
  );
} 