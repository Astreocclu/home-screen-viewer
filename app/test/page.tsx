'use client';

import { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import ScreenAreaSelector from '@/components/ScreenAreaSelector';
import ResultDisplay from '@/components/ResultDisplay';
import { ScreenArea } from '@/lib/aiService';

export default function TestPage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [screenAreas, setScreenAreas] = useState<ScreenArea[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  
  const handleImageUpload = (imageDataUrl: string) => {
    setOriginalImage(imageDataUrl);
    setScreenAreas([]);
    setGeneratedImage(null);
    setError(null);
  };
  
  const handleAreasSelected = (areas: ScreenArea[]) => {
    setScreenAreas(areas);
  };
  
  const handleGenerateVisualization = async () => {
    if (!originalImage) {
      setError('Please upload an image first');
      return;
    }
    
    if (!apiKey) {
      setError('Please enter an API key');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/visualize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalImageBase64: originalImage,
          screenAreas: screenAreas.length > 0 ? screenAreas : undefined,
          apiKey,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate visualization');
      }
      
      setGeneratedImage(data.imageUrl);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <main className="flex min-h-screen flex-col items-center p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Home Screen Visualizer - Test Page</h1>
      
      <div className="w-full mb-8">
        <h2 className="text-xl font-semibold mb-4">1. Upload an Image</h2>
        <ImageUploader onImageUpload={handleImageUpload} />
      </div>
      
      {originalImage && (
        <div className="w-full mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Select Window Areas (Optional)</h2>
          <ScreenAreaSelector
            imageUrl={originalImage}
            onAreasSelected={handleAreasSelected}
          />
        </div>
      )}
      
      {originalImage && (
        <div className="w-full mb-8">
          <h2 className="text-xl font-semibold mb-4">3. Generate Visualization</h2>
          
          <div className="flex flex-col gap-4 mb-4">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium mb-1">
                API Key (OpenAI)
              </label>
              <input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter your OpenAI API key"
              />
            </div>
            
            <button
              type="button"
              onClick={handleGenerateVisualization}
              disabled={!originalImage || isLoading}
              className="py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Generating...' : 'Generate Visualization'}
            </button>
          </div>
        </div>
      )}
      
      {originalImage && (
        <div className="w-full">
          <ResultDisplay
            originalImageUrl={originalImage}
            generatedImageUrl={generatedImage}
            isLoading={isLoading}
            error={error}
          />
        </div>
      )}
    </main>
  );
}
