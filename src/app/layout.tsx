import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import { Rethink_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

// const inter = Inter({ subsets: ["latin"] });
const rethinkSans = Rethink_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "YTZA - AI YouTube Thumbnails",
  description: "Generate stunning YouTube thumbnails with AI. Boost your clicks and engagement.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* <body className={inter.className}>{children}</body> */}
      <body className={rethinkSans.className}>
        {children}
        <Toaster richColors position="top-right" closeButton />
      </body>
    </html>
  );
}
