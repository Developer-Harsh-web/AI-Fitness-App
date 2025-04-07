"use client";

import { SessionProvider } from "next-auth/react";
import { UserContextProvider } from "../lib/hooks/UserContext";
import { AiPersonaProvider } from "../lib/hooks/useAiPersona";
import { CommunityProvider } from "../lib/hooks/useCommunity";
import { MealTrackingProvider } from "../lib/hooks/MealTrackingContext";
import React from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <UserContextProvider>
        <AiPersonaProvider>
          <CommunityProvider>
            <MealTrackingProvider>
              {children}
            </MealTrackingProvider>
          </CommunityProvider>
        </AiPersonaProvider>
      </UserContextProvider>
    </SessionProvider>
  );
} 