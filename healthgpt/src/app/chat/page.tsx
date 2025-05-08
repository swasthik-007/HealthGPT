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
      <Card>
        <CardHeader>
          <CardTitle>💬 Ask AI About Your Symptoms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="e.g. I’ve had a sore throat and mild fever for 2 days..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
          />
          <Button onClick={handleAsk} disabled={loading}>
            {loading ? "Thinking..." : "Ask AI"}
          </Button>
          {reply && (
            <div className="bg-muted p-4 rounded-lg text-sm whitespace-pre-wrap">
              {reply}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
