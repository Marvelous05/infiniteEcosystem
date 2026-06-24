import type { Metadata } from "next";
import Link from "next/link";
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
  title: "Infinite Biomedical Solutions",
  description: "Invoicing and billing for Infinite Biomedical Solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface text-foreground">
        <div className="w-full border-b px-6 py-4 bg-surface/95 shadow-sm">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                Infinite Biomedical Solutions
              </p>
            </div>
            <nav className="flex flex-wrap items-center gap-3 text-sm">
              <Link className="text-primary hover:underline" href="/">
                Dashboard
              </Link>
              <Link className="text-primary hover:underline" href="/invoices">
                Invoices
              </Link>
              <Link className="text-primary hover:underline" href="/clients">
                Clients
              </Link>
              <Link className="text-primary hover:underline" href="/products">
                Products
              </Link>
              <Link className="text-primary hover:underline" href="/tasks">
                Tasks
              </Link>
            </nav>
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
