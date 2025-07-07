import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Upload, Info, FileText, CheckCircle2 } from "lucide-react";
import { uploadImage } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

export function ImageUpload({ onAnalysis }: { onAnalysis: (message: string) => void }) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isMockResponse, setIsMockResponse] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setUploadProgress(0);
    setIsMockResponse(false);
    setAnalysisResult(null);

    try {
      const url = await uploadImage(
        file,
        (progress) => setUploadProgress(progress),
        (error) => {
          setError("Error uploading document. Please try again.");
          toast({
            variant: "destructive",
            title: "Upload Error",
            description: error.message,
          });
        }
      );

      setImageUrl(url);
      toast({
        title: "Upload Successful",
        description: "Document uploaded successfully",
      });
    } catch (error) {
      setError("Failed to upload document. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!imageUrl) return;

    setIsLoading(true);
    setError(null);
    setIsMockResponse(false);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_url: imageUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Handle timeout specifically
        if (errorData.isTimeout) {
          toast({
            variant: "destructive",
            title: "Analysis Timeout",
            description: "The analysis is taking longer than expected. Please try again.",
          });
          return;
        }

        throw new Error('Analysis failed');
      }

      const data = await response.json();

      // Check if this is a mock response
      if (data.source === 'mock') {
        setIsMockResponse(true);
      }

      setAnalysisResult(data.message);
      onAnalysis(data.message);

      // Show success toast if using LM Studio
      if (data.source === 'lm-studio') {
        toast({
          title: "Analysis Complete",
          description: "Document analysis completed successfully.",
        });
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        variant: "destructive",
        title: "Analysis Error",
        description: "Error analyzing document. Please try again.",
      });
      onAnalysis('Error analyzing document. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-[#000080] text-white py-2 px-4 rounded-t-md flex items-center">
        <FileText className="mr-2 h-5 w-5" />
        <h3 className="font-['Poppins'] font-semibold">Document Upload & Analysis</h3>
      </div>
      
      <div className="border-2 border-[#000080]/30 p-5 rounded-b-md bg-white">
        <div className="space-y-4">
          {!imageUrl && (
            <>
              <div className="bg-[#f8f9fa] p-3 border rounded-md mb-4 text-sm">
                <p className="font-semibold text-[#000080] mb-1">Guidelines for Document Upload:</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Upload clear images of official Indian documents</li>
                  <li>Ensure all text is clearly visible and legible</li>
                  <li>Supported formats: PNG, JPG, JPEG (Max. 10MB)</li>
                  <li>Documents will be securely processed</li>
                </ul>
              </div>
              
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-8 w-8 mb-2 text-[#000080]" />
                    <p className="mb-2 text-sm text-gray-600">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 10MB)</p>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isLoading}
                  />
                </label>
              </div>
            </>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md border border-red-200 text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="w-full h-2" />
              <p className="text-sm text-gray-600 text-center">
                Uploading... {Math.round(uploadProgress)}%
              </p>
            </div>
          )}

          {imageUrl && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-700 bg-green-50 p-2 rounded-md border border-green-200 text-sm mb-2">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                <span>Document uploaded successfully</span>
              </div>
              
              <div className="border rounded-md p-2 bg-gray-50">
                <img
                  src={imageUrl}
                  alt="Document Preview"
                  className="max-w-full h-auto rounded-md mx-auto"
                />
              </div>
              
              <Button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="w-full bg-[#000080] hover:bg-[#000060] text-white"
              >
                {isLoading ? 'Analyzing Document...' : 'Analyze Document'}
              </Button>
            </div>
          )}

          {analysisResult && (
            <div className="mt-4 p-4 bg-[#f8f9fa] rounded-md border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-full bg-[#138808] flex items-center justify-center">
                  <CheckCircle2 className="h-3 w-3 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[#000080]">Analysis Result</h3>
              </div>
              <div className="prose prose-sm max-w-none">
                {analysisResult.split('\n').map((line, index) => (
                  <p key={index} className="mb-2">{line}</p>
                ))}
              </div>
            </div>
          )}

          {isMockResponse && (
            <div className="flex items-center gap-2 text-amber-800 text-sm bg-amber-50 p-3 rounded-md border border-amber-200">
              <Info className="h-4 w-4 flex-shrink-0" />
              <div className="space-y-1">
                <p className="font-medium">Document Analysis Information</p>
                <p className="text-xs">
                  Available document types: Aadhaar, PAN, Passport, Driving License, and Voter ID.
                  Each analysis includes relevant service links and contact information.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}