"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";

export default function HomePage() {
  const { user, isLoaded } = useUser();

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col items-center justify-center px-4">
      <div className="bg-black/20 backdrop-blur-sm p-10 rounded-xl w-96 h-96 shadow-2xl flex flex-col">
        <div className="flex justify-center mb-6">
          <div className="text-primary text-4xl font-bold flex items-center gap-2">
            <span className="text-purple-500">🩺</span> HealthGPT
          </div>
        </div>

        <div className="text-center mb-auto">
          <p className="text-gray-300 text-sm">
            Your AI companion to understand medical reports, symptoms, and
            health trends — explained in simple terms.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          <Link href="/report" className="w-full">
            <Button className="w-full h-16" variant="default">
              Upload Report
            </Button>
          </Link>
          <Link href="/chat" className="w-full">
            <Button variant="outline" className="w-full h-16">
              Symptom Checker
            </Button>
          </Link>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            Trusted by users. Designed for peace of mind.
          </p>
        </div>
      </div>
    </main>
  );
}
