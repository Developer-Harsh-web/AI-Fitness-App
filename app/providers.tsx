"use client";

import { SessionProvider } from "next-auth/react";
import { UserContextProvider } from "../lib/hooks/UserContext";
import { AiPersonaProvider } from "../lib/hooks/useAiPersona";
import React from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <UserContextProvider>
        <AiPersonaProvider>{children}</AiPersonaProvider>
      </UserContextProvider>
    </SessionProvider>
  );
} 