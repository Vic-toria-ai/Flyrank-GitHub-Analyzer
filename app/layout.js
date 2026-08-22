import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "../components/SiteHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GitHub Analyzer",
  description: "Analyze and compare GitHub developer profiles with AI-powered insights.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950">
        <SiteHeader />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}