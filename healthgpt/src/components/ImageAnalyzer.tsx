"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ImageAnalyzer() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);

    if (file) {
      // Reset results when new file is selected
      setResult(null);
      setError(null);

      // Create an image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleAnalyze = async () => {
    if (!imageFile) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      console.log("Sending request to analyze image...");
      const res = await fetch("http://localhost:8000/vision/analyze", {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", res.status);

      // Handle non-OK responses
      if (!res.ok) {
        let errorText = "Server error";
        try {
          const errorData = await res.json();
          errorText =
            errorData.detail || `Error ${res.status}: ${res.statusText}`;
          console.error("Error details:", errorData);
        } catch (e) {
          errorText = `Error ${res.status}: ${res.statusText}`;
          console.error("Raw error:", e);
        }
        throw new Error(errorText);
      }

      const data = await res.json();
      console.log("Response data:", data);

      if (data.response) {
        setResult(data.response);
      } else {
        setError("Received empty response from server");
      }
    } catch (err: any) {
      console.error("❌ Error analyzing image:", err);
      setError(err.message || "Error analyzing the image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white dark:bg-gray-900 rounded-md shadow-md space-y-4">
      <h2 className="text-lg font-bold">
        🧠 Analyze Medical Image (Gemini Pro Vision)
      </h2>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Upload Image</label>
        <Input type="file" accept="image/*" onChange={handleFileChange} />
        {imageFile && (
          <p className="text-xs text-gray-500">
            Selected: {imageFile.name} ({(imageFile.size / 1024).toFixed(1)} KB)
          </p>
        )}
      </div>

      {preview && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Image Preview:</p>
          <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 mx-auto object-contain"
            />
          </div>
        </div>
      )}

      <Button
        onClick={handleAnalyze}
        disabled={!imageFile || loading}
        className="w-full"
      >
        {loading ? "Analyzing... Please wait" : "Analyze Image"}
      </Button>

      {loading && (
        <div className="text-center py-2">
          <div
            className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
          <p className="text-sm mt-2">
            Processing your image with Gemini AI...
          </p>
        </div>
      )}

      {/* {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )} */}

      {result && (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-sm">
          <h3 className="font-medium mb-2">📊 Analysis Results</h3>
          <div className="prose-headings:text-emerald-600 text-sm">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
