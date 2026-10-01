import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "ARIS – AI Reliability Insight System",
  description: "AI-integrated plant operations dashboard prototype",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-screen overflow-hidden">
      <body className="h-full flex flex-col bg-[#f4f6f9] overflow-hidden">
        <Navbar />
        {/* main fills all remaining height; each page manages its own scroll */}
        <main className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
