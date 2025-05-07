"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DownloadButton } from "@/components/DownloadButton";
import { supabase } from "@/lib/subabaseClient";

export default function ReportPage() {
  // Add animation keyframes
  const styles = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.3s ease-out forwards;
    }
  `;

  const { user } = useUser();
  const [file, setFile] = useState(null);
  const [analyzedData, setAnalyzedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom of chat container when messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Initial chat message after analysis
  useEffect(() => {
    if (analyzedData && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: `I've analyzed your medical report. The main findings are: ${analyzedData.summary} Would you like me to explain anything specific about your results?`,
        },
      ]);
    }
  }, [analyzedData]);

  const saveReportToSupabase = async (reportData) => {
    if (!user) return;
    const { error } = await supabase.from("reports").insert([
      {
        user_id: user.id,
        title: `Report - ${new Date().toLocaleString()}`,
        summary: reportData.summary,
        values: reportData.flags || [],
      },
    ]);
    if (error) console.error("Error saving report:", error);
  };

  const handleAnalyze = async () => {
    if (!file || !user) return;
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // 1. Upload file to extract text
      const uploadRes = await fetch("http://localhost:8000/report/upload", {
        method: "POST",
        body: formData,
      });
      const { text } = await uploadRes.json();

      // 2. Analyze extracted text
      const analyzeRes = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const analyzed = await analyzeRes.json();
      setAnalyzedData(analyzed);

      // 3. Save in Supabase
      await saveReportToSupabase(analyzed);

      // 4. ?Send to Gmail - Optional, can be removed if causing delay
      await fetch("http://localhost:8000/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user?.emailAddresses[0]?.emailAddress,
          report_data: analyzed,
        }),
      });

      // alert("Report analyzed and sent to your email!");
    } catch (error) {
      alert("Error analyzing report");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || !analyzedData) return;

    setIsSending(true);
    const newUserMessage = { role: "user", content: userInput };
    const currentInput = userInput;

    // Update messages immediately with user input
    setMessages((prev) => [...prev, newUserMessage]);
    setUserInput("");

    try {
      // Only send the last few messages to reduce payload size
      const recentMessages = messages.slice(-4).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Send message and report data summary to the backend
      // Optimize by sending only essential report data
      const essentialReportData = {
        summary: analyzedData.summary,
        diagnosis: analyzedData.diagnosis || [],
        warnings: analyzedData.warnings || [],
      };

      const response = await fetch("http://localhost:8000/chat/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentInput,
          report_data: essentialReportData,
          chat_history: recentMessages,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Add AI response to chat
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I encountered an error processing your question. Please try again.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-row gap-6 w-full h-screen p-4">
      <style>{styles}</style>
      {/* Left Panel - Upload */}
      <div className="w-1/2">
        <Card className="shadow-md bg-white dark:bg-gray-800 h-full overflow-hidden">
          <CardContent className=" p-6 flex flex-col  h-full">
            <h1 className="text-xl font-bold text-center mb-6">
              Upload Medical Report
            </h1>

            {/* Upload Section */}
            <div className="mb-6 ">
              <Input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="mb-4 bg-[white]"
              />
              {file && (
                <p className="text-sm text-gray-500 mb-2">
                  Selected: {file.name}
                </p>
              )}
              <Button
                onClick={handleAnalyze}
                disabled={!file || isLoading}
                className="w-full"
              >
                {isLoading ? "Analyzing..." : "Analyze Report"}
              </Button>
            </div>

            {/* Results Section */}
            {analyzedData && (
              <div className="space-y-4 flex-1 overflow-y-auto">
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
                  <h2 className="font-semibold text-lg mb-2">Summary</h2>
                  <p className="mb-4 text-sm">{analyzedData.summary}</p>

                  {/* Key findings */}
                  {[
                    "diagnosis",
                    "warnings",
                    "remedies",
                    "lifestyle_changes",
                    "medicine_suggestions",
                  ]
                    .filter((key) => analyzedData[key]?.length > 0)
                    .map((key) => (
                      <div key={key} className="mb-3">
                        <h3 className="font-medium mb-1 text-sm">
                          {key.replace(/_/g, " ").charAt(0).toUpperCase() +
                            key.replace(/_/g, " ").slice(1)}
                        </h3>
                        <ul className="list-disc pl-5 text-sm">
                          {analyzedData[key].map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </div>

                <div className="flex gap-2">
                  <DownloadButton reportData={analyzedData} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Panel - Chat */}
      <div className="w-1/2">
        <Card className="shadow-md bg-white dark:bg-gray-800 h-full">
          <CardContent className="p-6 flex flex-col h-full">
            <h2 className="text-xl font-bold mb-4">Chat with HealthGPT</h2>

            {/* Chat Messages */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto mb-4 p-2 border border-gray-100 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900"
            >
              {messages.length > 0 ? (
                <div className="space-y-4 py-2">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex mb-2 ${
                        msg.role === "assistant"
                          ? "justify-start"
                          : "justify-end"
                      }`}
                    >
                      <div
                        className={`max-w-[75%] p-3 my-[3] text-sm shadow-md ${
                          msg.role === "assistant"
                            ? "bg-[#83ab62]  text-[#0e130a] dark:bg-gray-700 text-gray-800 dark:text-white rounded-[5px]"
                            : "bg-[#dcf8c6]  text-[#0e130a] rounded-[5px]"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 p-6 text-center">
                  <div className="w-16 h-16 mb-4 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
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
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                  {analyzedData
                    ? "Loading conversation..."
                    : "Analyze a report to start chatting about your results"}
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="flex gap-2 mt-2">
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask about your report..."
                disabled={!analyzedData || isSending}
                className="flex-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500"
              />
              <Button
                type="submit"
                disabled={!analyzedData || !userInput.trim() || isSending}
                className="bg-blue-500 hover:bg-blue-600 px-4"
              >
                {isSending ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Sending</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span>Send</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-1 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
