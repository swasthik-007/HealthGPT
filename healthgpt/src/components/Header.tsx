"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import ThemeToggle from "./ThemeToggle";
import { useState } from "react";
import "../styles/globals.css"; // Ensure global styles are imported
import { ScanHeart } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-black py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-12">
        {/* Logo - left side */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-purple-500 text-2xl">🩺</span>
            <span className="text-white text-xl font-bold tracking-wide">
              HealthGPT
            </span>
          </Link>
        </div>

        {/* Empty space in the middle */}
        <div className="flex-grow"></div>

        {/* Controls - right side with lots of spacing */}
        <div className="flex items-center gap-[8]">
          {/* Desktop Navigation */}
          {/* <nav className="hidden md:flex items-center gap-[8]">
            <Link
              href="/report"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Upload
            </Link>
            <Link
              href="/chat"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Chat
            </Link>
            <Link
              href="/history"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Trends
            </Link>
          </nav> */}

          {/* Theme toggle with good spacing */}
          <div className="flex items-center">
            <Link href="/image-analyzer" className="flex items-center gap-3">
              {/* <span className="text-purple-500 text-2xl">🩺</span>
            <span className="text-white text-xl font-bold tracking-wide">
              HealthGPT
            </span> */}
              <ScanHeart />
            </Link>
          </div>
          <div className="ml-4">
            <ThemeToggle />
          </div>

          {/* Auth with good spacing */}
          <div className="ml-4 mr-[8]">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <Link
                href="/sign-in"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white"
              >
                Login
              </Link>
            </SignedOut>
          </div>

          {/* Mobile menu button */}
          {/* <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {mobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div> */}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {/* {mobileMenuOpen && (
        <div className="md:hidden mt-4 py-4 border-t border-gray-800">
          <nav className="flex flex-col gap-6 px-4">
            <Link
              href="/report"
              className="text-gray-300 hover:text-white transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Upload
            </Link>
            <Link
              href="/chat"
              className="text-gray-300 hover:text-white transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Chat
            </Link>
            <Link
              href="/history"
              className="text-gray-300 hover:text-white transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Trends
            </Link>
            <SignedOut>
              <Link
                href="/sign-in"
                className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            </SignedOut>
          </nav>
        </div>
      )} */}
    </header>
  );
}
