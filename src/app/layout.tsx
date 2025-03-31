import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/providers/Providers";
// import { Analytics } from "@vercel/analytics/react";

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
      {/* <head>
        <script src="https://unpkg.com/react-scan/dist/auto.global.js"></script>
      </head> */}

      <Providers>
        <body suppressHydrationWarning>{children}</body>
      </Providers>
    </html>
  );
}
