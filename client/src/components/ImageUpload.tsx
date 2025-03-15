
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ImageUpload({ onAnalysis }: { onAnalysis: (message: string) => void }) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create object URL for preview
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  };

  const handleAnalyze = async () => {
    if (!imageUrl) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_url: imageUrl }),
      });

      const data = await response.json();
      onAnalysis(data.message);
    } catch (error) {
      console.error('Error analyzing image:', error);
      onAnalysis('Error analyzing image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-4 w-full max-w-md mx-auto mb-4">
      <div className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full"
        />
        {imageUrl && (
          <div className="space-y-4">
            <img src={imageUrl} alt="Preview" className="max-w-full h-auto rounded" />
            <Button 
              onClick={handleAnalyze}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Analyzing...' : 'Analyze Image'}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
