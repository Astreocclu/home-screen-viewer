/**
 * Utility functions for image handling
 */

/**
 * Validates if a string is a valid data URL for an image
 * @param dataUrl The data URL string to validate
 * @returns True if the data URL is valid, false otherwise
 */
export function isValidImageDataUrl(dataUrl: string): boolean {
  if (!dataUrl) return false;

  // Check if it starts with the data URL prefix for images
  if (!dataUrl.startsWith('data:image/')) return false;

  // Check if it has the base64 format
  if (!dataUrl.includes(';base64,')) return false;

  // Validate the base64 content
  try {
    const base64Content = dataUrl.split(';base64,')[1];
    if (!base64Content || base64Content.trim() === '') return false;

    // Try to decode the base64 content to verify it's valid
    // This will throw an error if the base64 is malformed
    atob(base64Content);

    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Extracts the image format from a data URL
 * @param dataUrl The data URL string
 * @returns The image format (e.g., 'jpeg', 'png') or null if invalid
 */
export function getImageFormatFromDataUrl(dataUrl: string): string | null {
  if (!isValidImageDataUrl(dataUrl)) return null;

  try {
    // Extract the format from the data URL
    const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9]+);base64,/);
    if (!matches || matches.length < 2) return null;

    return matches[1].toLowerCase();
  } catch (error) {
    return null;
  }
}

/**
 * Calculates the approximate size of an image from its data URL
 * @param dataUrl The data URL string
 * @returns The approximate size in bytes, or -1 if invalid
 */
export function getImageSizeFromDataUrl(dataUrl: string): number {
  if (!isValidImageDataUrl(dataUrl)) return -1;

  try {
    // Extract the base64 data
    const base64Data = dataUrl.split(',')[1];
    if (!base64Data) return -1;

    // Calculate approximate size (base64 encodes 3 bytes in 4 characters)
    const approximateSize = Math.floor((base64Data.length * 3) / 4);

    return approximateSize;
  } catch (error) {
    return -1;
  }
}

/**
 * Checks if an image size is within the allowed limit
 * @param dataUrl The data URL string
 * @param maxSizeInBytes The maximum allowed size in bytes
 * @returns True if the image is within the size limit, false otherwise
 */
export function isImageWithinSizeLimit(dataUrl: string, maxSizeInBytes: number): boolean {
  const size = getImageSizeFromDataUrl(dataUrl);
  if (size === -1) return false;

  return size <= maxSizeInBytes;
}
