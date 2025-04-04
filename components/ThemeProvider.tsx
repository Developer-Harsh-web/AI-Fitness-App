"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);

  // Use useEffect to update the state after client-side hydration
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid rendering anything theme-specific before hydration to prevent hydration mismatches
  // Only the children are shown, with no theme applied
  if (!mounted) {
    return (
      <div style={{ visibility: "hidden" }}>{children}</div>
    );
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
} 