import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DesignWeave - AI-Powered Design Generator",
  description: "Transform natural language into live UI designs. Powered by Claude AI. Export as React, Tailwind, or CSS.",
  keywords: ["AI design", "UI generator", "Claude AI", "React components", "Tailwind CSS", "design tool"],
  authors: [{ name: "Poolchaos" }],
  creator: "Poolchaos",
  openGraph: {
    type: "website",
    title: "DesignWeave - AI-Powered Design Generator",
    description: "Transform natural language descriptions into live UI designs with AI",
    siteName: "DesignWeave",
  },
  twitter: {
    card: "summary_large_image",
    title: "DesignWeave - AI-Powered Design Generator",
    description: "Transform words into designs with Claude AI",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
