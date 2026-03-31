import type { Metadata } from "next";
import Link from "next/link";
import { Fraunces, Space_Grotesk } from "next/font/google";
import "./globals.css";

const sans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans"
});

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  title: "Design Language Assistant MVP",
  description: "Turn themes and images into a design language that feels ready for UI work."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${display.variable}`}>
        <div className="page-shell py-4 md:py-6">
          <header className="site-header mb-6 md:mb-8">
            <Link className="wordmark" href="/">
              <span className="wordmark-mark">DLA</span>
              <span className="wordmark-copy">
                <span className="wordmark-title">Design Language Assistant</span>
                <span className="wordmark-subtitle">Theme-to-system MVP</span>
              </span>
            </Link>

            <nav className="flex flex-wrap items-center gap-1 text-sm font-medium">
              <Link className="nav-link" href="/">
                Landing
              </Link>
              <Link className="nav-link" href="/workspace">
                Workspace
              </Link>
              <Link className="nav-link" href="/result">
                Result
              </Link>
            </nav>

            <Link className="cta-secondary px-4 py-2 text-sm" href="/workspace">
              New run
            </Link>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
