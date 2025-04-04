import "./globals.css";
import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import { UserContextProvider } from '../lib/hooks/UserContext';
import { MealTrackingProvider } from '../lib/hooks/MealTrackingContext';
import NextAuthSessionProvider from '../components/providers/SessionProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "FitCoach - Your AI Fitness Companion",
  description: "Track your fitness journey and get personalized recommendations with FitCoach.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthSessionProvider>
          <UserContextProvider>
            <MealTrackingProvider>
              {children}
            </MealTrackingProvider>
          </UserContextProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
