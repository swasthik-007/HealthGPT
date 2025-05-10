"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setReply("");

    const res = await fetch("https://healthgpt-2.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input }),
    });

    const data = await res.json();
    setReply(data.reply);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>

      <Card>
        <CardHeader>
          <CardTitle className="h-[60px] text-[40px] text-center">
            💬 Ask AI About Your Symptoms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="e.g. I’ve had a sore throat and mild fever for 2 days..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
            className="text-center text-[20px]"
          />
          <Button
            onClick={handleAsk}
            disabled={loading}
            className="text-center text-[20px] w-full h-[40px]"
          >
            {loading ? "Thinking..." : "Ask AI"}
          </Button>

          {reply && (
            <div className="bg-[#f8fafc] dark:bg-[#1e293b] p-6 rounded-xl text-base leading-relaxed shadow-sm border border-gray-200 dark:border-gray-700 animate-fade-in">
              {reply.split("\n").map((line, idx) => (
                <p key={idx} className="mb-2">
                  {line}
                </p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
