import { useState, useRef, ChangeEvent } from 'react';

interface ImageUploaderProps {
  onImageUpload: (imageDataUrl: string) => void;
  maxSizeInMB?: number;
  acceptedFormats?: string[];
}

/**
 * Component for uploading and previewing images
 */
export default function ImageUploader({
  onImageUpload,
  maxSizeInMB = 5,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp'],
}: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert maxSizeInMB to bytes
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  // Format the accepted formats for the file input
  const acceptString = acceptedFormats.join(',');

  /**
   * Handle file selection
   */
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);

    // Validate file selection
    if (!file) {
      setError('No file selected');
      return;
    }

    // Validate file type
    if (!acceptedFormats.includes(file.type)) {
      setError(`Invalid file type. Accepted formats: ${acceptedFormats.join(', ')}`);
      return;
    }

    // Validate file size
    if (file.size > maxSizeInBytes) {
      setError(`File size exceeds the maximum limit of ${maxSizeInMB}MB`);
      return;
    }

    // Read the file as a data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreviewUrl(dataUrl);
      onImageUpload(dataUrl);
    };
    reader.onerror = () => {
      setError('Error reading the file');
    };
    reader.readAsDataURL(file);
  };

  /**
   * Trigger file selection dialog
   */
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md">
      <div className="w-full">
        <button
          type="button"
          onClick={handleButtonClick}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Upload an image"
        >
          Upload Image
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptString}
          onChange={handleFileChange}
          className="hidden"
          role="textbox"
        />
      </div>

      {error && (
        <div className="w-full p-3 bg-red-100 text-red-700 rounded-lg" role="alert">
          {error}
        </div>
      )}

      {previewUrl && (
        <div className="w-full">
          <h3 className="text-lg font-medium mb-2">Preview</h3>
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-300">
            <img
              src={previewUrl}
              alt="Preview of uploaded image"
              className="object-contain w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
