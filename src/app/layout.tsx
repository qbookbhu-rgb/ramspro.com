
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RAMS.com | Your Health Companion',
  description: 'Find doctors, check symptoms with AI, and book appointments online or in-clinic.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
