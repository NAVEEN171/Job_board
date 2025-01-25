import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/providers/Providers";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "FlexiBoard",
  description: "Build, Manage, and Analyze Your Perfect Job Board",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <Providers>
        <body suppressHydrationWarning>{children}</body>
      </Providers>
    </html>
  );
}
