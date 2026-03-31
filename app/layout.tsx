import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Design Language Assistant MVP",
  description: "A one-day MVP skeleton for turning themes and images into design language."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="page-shell py-6">
          <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <Link className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-700" href="/">
              Design Language Assistant
            </Link>
            <nav className="flex items-center gap-4 text-sm text-stone-700">
              <Link href="/">Landing</Link>
              <Link href="/workspace">Workspace</Link>
              <Link href="/result">Result</Link>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}

