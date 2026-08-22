import "./globals.css";
import SiteHeader from "../components/SiteHeader";

export const metadata = {
  title: "GitHub Analyzer",
  description: "Analyze and compare GitHub developer profiles with AI-powered insights.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-zinc-950">
        <SiteHeader />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}