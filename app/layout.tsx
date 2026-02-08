import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { NavbarVisibility } from "@/components/NavbarVisibility";
import { ClickHeartEffect } from '@/components/ui/click-heart-effect'
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Love Story",
  description: "A modern gallery for couple memories",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <ClickHeartEffect />
        <NavbarVisibility>
          <Suspense fallback={<div className="h-16 border-b bg-background/80" />}>
            <Navbar />
          </Suspense>
        </NavbarVisibility>
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
