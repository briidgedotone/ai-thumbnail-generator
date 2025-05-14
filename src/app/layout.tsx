import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import { Rethink_Sans } from "next/font/google";
import "./globals.css";

// const inter = Inter({ subsets: ["latin"] });
const rethinkSans = Rethink_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Modern Landing Page",
  description: "A beautiful landing page built with Next.js, Tailwind CSS, and shadcn UI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* <body className={inter.className}>{children}</body> */}
      <body className={rethinkSans.className}>{children}</body>
    </html>
  );
}
