"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";

export default function HomePage() {
  const { user, isLoaded } = useUser();
  console.log("clerk", user?.id);
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col items-center justify-center px-4">
      <Card className="w-full max-w-xl bg-card shadow-xl border rounded-2xl">
        <CardContent className="p-8 text-center">
          <h1 className="text-4xl font-bold mb-3">🩺 HealthGPT</h1>
          <p className="text-muted-foreground mb-6 text-sm">
            Your AI companion to understand medical reports, symptoms, and
            health trends — explained in simple terms.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/report">
              <Button className="px-6 py-2 w-full sm:w-auto">
                Upload Report
              </Button>
            </Link>
            <Link href="/chat">
              <Button variant="outline" className="px-6 py-2 w-full sm:w-auto">
                Symptom Checker
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground mt-8">
        Trusted by users. Designed for peace of mind.
      </p>
    </main>
  );
}
