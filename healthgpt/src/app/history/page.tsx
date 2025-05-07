"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/subabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HistoryPage() {
  // const { user } = useUser();
  const { user, isLoaded } = useUser();
  console.log("clerk", user?.id); // Make sure this logs something
  const testInsert = async () => {
    const { error } = await supabase.from("reports").insert([
      {
        user_id: "user_2wjijHUUwe3Vwn4uDXIsRC5PEFT",
        title: "Test Report",
        summary: "This is a test summary",
        values: [],
      },
    ]);
    console.log("Insert Error:", error);
  };

  const [reports, setReports] = useState([]);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchReports = async () => {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("user_id", user.id); // safe now

      console.log("📄 Data:", data);
      console.log("⚠️ Error:", error);

      if (data) setReports(data); // ✅ This was missing
    };

    fetchReports();
  }, [isLoaded, user]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">📚 Report History</h1>

      {reports.length === 0 ? (
        <p className="text-gray-500">No reports found.</p>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <CardTitle>{report.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">
                  {new Date(report.created_at).toLocaleString()}
                </p>
                <p className="text-gray-600 text-sm">{report.summary}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
