import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Upload, Info } from "lucide-react";
import { uploadImage } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

export function ImageUpload({ onAnalysis }: { onAnalysis: (message: string) => void }) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isMockResponse, setIsMockResponse] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setUploadProgress(0);
    setIsMockResponse(false);

    try {
      const url = await uploadImage(
        file,
        (progress) => setUploadProgress(progress),
        (error) => {
          setError("Error uploading image. Please try again.");
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
        description: "Image uploaded successfully",
      });
    } catch (error) {
      setError("Failed to upload image. Please try again.");
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

    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_url: imageUrl }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();

      // Check if this is a mock response
      if (data.source === 'mock') {
        setIsMockResponse(true);
      }

      onAnalysis(data.message);
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        variant: "destructive",
        title: "Analysis Error",
        description: "Error analyzing image. Please try again.",
      });
      onAnalysis('Error analyzing image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-4 w-full max-w-md mx-auto mb-4">
      <div className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/70 transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">PNG, JPG or JPEG (MAX. 10MB)</p>
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

        {error && (
          <div className="flex items-center gap-2 text-destructive text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="space-y-2">
            <Progress value={uploadProgress} className="w-full" />
            <p className="text-sm text-muted-foreground text-center">
              Uploading... {Math.round(uploadProgress)}%
            </p>
          </div>
        )}

        {imageUrl && (
          <div className="space-y-4">
            <img 
              src={imageUrl} 
              alt="Preview" 
              className="max-w-full h-auto rounded-lg border"
            />
            <Button 
              onClick={handleAnalyze}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Analyzing...' : 'Analyze Image'}
            </Button>
          </div>
        )}

        {isMockResponse && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm bg-muted/50 p-3 rounded-lg border border-border">
            <Info className="h-4 w-4 flex-shrink-0" />
            <div className="space-y-1">
              <p className="font-medium">Using Document Analysis Preview</p>
              <p className="text-xs">
                Currently using mock responses for quick document identification. 
                Upload government documents like Aadhaar, PAN, passport, or driving license for basic information.
                Full AI-powered analysis coming soon.
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}