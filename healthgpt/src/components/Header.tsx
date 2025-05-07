"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import ThemeToggle from "./ThemeToggle";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full border-b border-border bg-gradient-to-r from-emerald-50 via-white to-emerald-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400 flex items-center gap-3 hover:opacity-90 transition-opacity"
          >
            <span className="text-3xl">🩺 HealthGPT</span>
            {/* <span className="bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 text-transparent bg-clip-text">
              HealthGPT
            </span> */}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link
              href="/report"
              className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400 transition-colors py-2"
            >
              <span className="text-lg">📤</span> Upload
            </Link>
            <Link
              href="/chat"
              className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400 transition-colors py-2"
            >
              <span className="text-lg">💬</span> Chat
            </Link>
            <Link
              href="/history"
              className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400 transition-colors py-2"
            >
              <span className="text-lg">📊</span> Trends
            </Link>
            <Link
              href="/faq"
              className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400 transition-colors py-2"
            >
              <span className="text-lg">❓</span> FAQ
            </Link>

            {/* Theme toggle */}
            <div className="ml-2">
              <ThemeToggle />
            </div>

            {/* Auth buttons */}
            <SignedIn>
              <div className="ml-2">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
            <SignedOut>
              <Link
                href="/sign-in"
                className="ml-2 px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-full hover:shadow-md hover:from-emerald-700 hover:to-teal-600 transition-all text-sm font-medium"
              >
                🔐 Login
              </Link>
            </SignedOut>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden pt-4 pb-2 flex flex-col gap-3 text-sm font-medium border-t border-gray-100 dark:border-gray-800 mt-4">
            <Link
              href="/report"
              className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="text-lg">📤</span> Upload
            </Link>
            <Link
              href="/chat"
              className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="text-lg">💬</span> Chat
            </Link>
            <Link
              href="/history"
              className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="text-lg">📊</span> Trends
            </Link>
            <Link
              href="/faq"
              className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="text-lg">❓</span> FAQ
            </Link>
            <SignedOut>
              <Link
                href="/sign-in"
                className="mt-2 px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-full hover:shadow-md hover:from-emerald-700 hover:to-teal-600 transition-all text-sm font-medium w-full text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                🔐 Login
              </Link>
            </SignedOut>
          </nav>
        )}
      </div>
    </header>
  );
}
