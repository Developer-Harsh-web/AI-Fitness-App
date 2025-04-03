import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserContextProvider } from "../lib/hooks/UserContext";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "FitCoach - Your Personal Fitness Companion",
  description: "Track your workouts, meals, and health data with personalized motivation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased bg-gray-50 dark:bg-gray-900`}
      >
        <UserContextProvider>
          {children}
        </UserContextProvider>
      </body>
    </html>
  );
}
