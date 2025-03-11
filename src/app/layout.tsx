import type { Metadata } from "next";
import { Bebas_Neue } from "next/font/google";

import Head from "@/components/head";

import "./globals.css";

const bebas_neu = Bebas_Neue({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-bebas_neue",
  display: "swap",
});

export const metadata: Metadata = {
  title: "API Documentation Template",
  description:
    "Modern API documentation template built with Next.js and shadcn",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head />
      <body className={`${bebas_neu.variable}`}>{children}</body>
    </html>
  );
}
