"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface DownloadButtonProps {
  reportData: {
    summary: string;
    flags: { label: string; value: string; risk: string }[];
    remedies: { label: string; food: string }[];
    explanation: Record<string, string>;
  };
}

export const DownloadButton = ({ reportData }: DownloadButtonProps) => {
  const handleDownload = async () => {
    if (!reportData) {
      alert("No report data available to download.");
      return;
    }

    console.log("Sending report_data:", reportData);

    try {
      const response = await fetch("https://healthgpt-2.onrender.com
/report/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report_data: reportData }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        throw new Error(`Download failed: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "HealthGPT_Report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Could not download the report.");
    }
  };

  return (
    <Button onClick={handleDownload} className="w-full mt-4">
      <Download className="mr-2 h-4 w-4" />
      Download Report
    </Button>
  );
};
