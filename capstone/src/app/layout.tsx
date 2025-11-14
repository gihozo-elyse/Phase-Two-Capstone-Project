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
  title: "Nova",
  description: "A Medium-like publishing platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-zinc-900 dark:bg-black dark:text-zinc-50`}>
        <header className="border-b border-zinc-200/70 dark:border-zinc-800/70">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex h-16 items-center justify-between">
              <Link href="/" className="text-lg font-semibold tracking-tight">
                Nova
              </Link>
              <nav className="flex items-center gap-6 text-sm">
                <Link href="/" className="hover:opacity-80">
                  Home
                </Link>
              </nav>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
          {children}
        </main>
        <footer className="mt-8 border-t border-zinc-200/70 py-8 text-sm text-zinc-500 dark:border-zinc-800/70">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            © {new Date().getFullYear()} Nova
          </div>
        </footer>
      </body>
    </html>
  );
}
