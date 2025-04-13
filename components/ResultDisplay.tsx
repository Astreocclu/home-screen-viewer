interface ResultDisplayProps {
  originalImageUrl: string;
  generatedImageUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Component for displaying the original and generated images side by side
 */
export default function ResultDisplay({
  originalImageUrl,
  generatedImageUrl,
  isLoading,
  error,
}: ResultDisplayProps) {
  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Results</h2>
      
      {error && (
        <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-lg" role="alert">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original Image */}
        <div className="flex flex-col">
          <h3 className="text-lg font-medium mb-2">Original Image</h3>
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-300">
            <img
              src={originalImageUrl}
              alt="Original house image"
              className="object-contain w-full h-full"
            />
          </div>
        </div>
        
        {/* Generated Image */}
        <div className="flex flex-col">
          <h3 className="text-lg font-medium mb-2">With Screens</h3>
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-300 bg-gray-50">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="sr-only">Loading...</span>
              </div>
            ) : generatedImageUrl ? (
              <img
                src={generatedImageUrl}
                alt="House with screens visualization"
                className="object-contain w-full h-full"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                Visualization will appear here
              </div>
            )}
          </div>
        </div>
      </div>
      
      {generatedImageUrl && (
        <div className="mt-6">
          <a
            href={generatedImageUrl}
            download="house-with-screens.jpg"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Download Result
          </a>
        </div>
      )}
    </div>
  );
}
