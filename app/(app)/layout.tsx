import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import AppShell from '@/components/layout/AppShell';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FitAI - Your Personal AI Fitness Coach',
  description: 'Track your fitness, nutrition, and wellness with the help of AI',
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell>{children}</AppShell>
  );
} 