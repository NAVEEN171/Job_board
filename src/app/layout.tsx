import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";



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
    <html lang="en">
      
      <body
        className={`new`}
      >
        {children}
      </body>
    </html>
  );
}
