import type { Metadata } from "next";
import { Rethink_Sans } from "next/font/google";
import "./globals.css";

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
      <body className={rethinkSans.className}>{children}</body>
    </html>
  );
}
