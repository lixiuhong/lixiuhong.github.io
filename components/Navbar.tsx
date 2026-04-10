"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { href: "/", label: "About" },
  { href: "/publications", label: "Publications" },
  { href: "/talks", label: "Talks" },
];

export default function Navbar({ name, cvUrl }: { name: string; cvUrl?: string }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-gray-200 dark:border-slate-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="font-bold text-lg text-accent dark:text-accent-dark no-underline hover:no-underline">
            {name}
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm no-underline hover:no-underline transition-colors ${
                  pathname === link.href
                    ? "text-accent dark:text-accent-dark font-medium"
                    : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {cvUrl && (
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm bg-accent text-white px-3 py-1.5 rounded no-underline hover:no-underline hover:bg-accent/90 transition-colors"
              >
                Download CV
              </a>
            )}
            <ThemeToggle />
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800"
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-2 py-1.5 rounded text-sm no-underline hover:no-underline ${
                  pathname === link.href
                    ? "text-accent dark:text-accent-dark font-medium"
                    : "text-gray-600 dark:text-slate-400"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {cvUrl && (
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-2 py-1.5 text-sm text-accent dark:text-accent-dark no-underline hover:no-underline"
              >
                Download CV
              </a>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
