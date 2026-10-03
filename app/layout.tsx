import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavbarClient from "@/components/NavbarClient";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ARIS Dashboard",
  description: "Plant Operations & Risk Intelligence",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable} antialiased bg-gray-50`}>
        <div className="flex flex-col h-screen overflow-hidden">
          <NavbarClient />
          <main className="flex-1 min-h-0 overflow-hidden flex flex-col">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
