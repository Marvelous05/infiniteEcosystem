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
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <div className="w-full bg-primary px-6 py-5 shadow-[0_24px_80px_rgba(16,45,114,0.18)]">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.35em] text-white/70">
                Infinite Biomedical Solutions
              </p>
              <h1 className="text-xl font-semibold text-white sm:text-2xl">
                Billing, invoicing & task flow
              </h1>
            </div>

            <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-white">
              <Link className="transition hover:text-accent" href="/">
                Dashboard
              </Link>
              <Link className="transition hover:text-accent" href="/invoices">
                Invoices
              </Link>
              <Link className="transition hover:text-accent" href="/clients">
                Clients
              </Link>
              <Link className="transition hover:text-accent" href="/products">
                Products
              </Link>
              <Link className="transition hover:text-accent" href="/tasks">
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
