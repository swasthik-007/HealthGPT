"use client";
import { Stethoscope, FileUp, MessageCircle } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import ThemeToggle from "./ThemeToggle";
import "../styles/globals.css";
import { ScanHeart } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full bg-black py-4 px-6 animate-fade-in">
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-in-out forwards;
        }

        .hover-scale {
          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        .hover-scale:hover {
          transform: scale(1.1);
          opacity: 0.9;
        }
      `}</style>

      <div className="max-w-7xl mx-auto flex justify-between items-center h-12">
        {/* Logo - left side */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-3 hover-scale">
            <Stethoscope className="text-purple-500 text-2xl" />
            <span className="text-white text-xl font-bold tracking-wide">
              HealthGPT
            </span>
          </Link>
        </div>

        <div className="flex-grow"></div>

        {/* Controls - right side */}
        <div className="flex items-center gap-[8]">
          <div className="flex items-center hover-scale">
            <Link href="/chat" className="flex items-center gap-3 mr-[8]">
              <MessageCircle className="flex items-center gap-[3] mr-[8]" />
            </Link>
          </div>
          <div className="flex items-center hover-scale">
            <Link href="/report" className="flex items-center gap-3 mr-[8]">
              <FileUp className="flex items-center gap-[3] mr-[8]" />
            </Link>
          </div>
          <div className="flex items-center hover-scale">
            <Link
              href="/image-analyzer"
              className="flex items-center gap-3 mr-[8]"
            >
              <ScanHeart />
            </Link>
          </div>
          <div className=" hover-scale mr-[8]">
            <ThemeToggle />
          </div>

          <div className=" mr-[8]">
            <SignedIn>
              <div className="hover-scale">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
            <SignedOut>
              <Link
                href="/sign-in"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white transition-transform duration-200 hover:scale-105"
              >
                Login
              </Link>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  );
}
