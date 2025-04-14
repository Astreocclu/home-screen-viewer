/**
 * AI Service for generating visualizations of houses with screens
 * This service interacts with the OpenAI API to generate images
 */

export interface ScreenArea {
  id: string;
  points: { x: number; y: number }[];
}

export interface GenerateVisualizationOptions {
  originalImageBase64: string;
  screenAreas?: ScreenArea[];
  apiKey: string;
}

export interface GenerateVisualizationResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

/**
 * Prepares a prompt for the OpenAI API based on the screen areas
 * @param screenAreas Array of screen areas defined by the user
 * @returns A string prompt describing where to place screens
 */
function preparePrompt(screenAreas?: ScreenArea[]): string {
  if (!screenAreas || screenAreas.length === 0) {
    return "Add window screens to all visible windows in this house image. Make the screens look realistic and integrated with the existing windows.";
  }

  // Create a more specific prompt based on the screen areas
  return `Add window screens to the specific areas I've marked in this house image.
  There are ${screenAreas.length} marked areas where screens should be placed.
  Make the screens look realistic with a fine mesh texture and proper integration with the window frames.
  The screens should be visible but not overly dark or distracting.`;
}

/**
 * Extracts the base64 data from a data URL
 * @param dataUrl The data URL string (e.g., "data:image/jpeg;base64,/9j/4AAQ...")
 * @returns The base64 data without the prefix
 */
function extractBase64Data(dataUrl: string): string {
  const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid data URL format');
  }
  return matches[2];
}

/**
 * Generates a visualization of a house with screens using the OpenAI API
 * @param options Options for generating the visualization
 * @returns Result of the visualization generation
 */
export async function generateVisualization(
  options: GenerateVisualizationOptions
): Promise<GenerateVisualizationResult> {
  try {
    const { originalImageBase64, screenAreas, apiKey } = options;

    if (!apiKey) {
      return {
        success: false,
        error: "API key is required",
      };
    }

    // Prepare the prompt based on the screen areas
    const prompt = preparePrompt(screenAreas);

    // Extract the base64 data from the data URL
    const base64Data = extractBase64Data(originalImageBase64);

    // Prepare the request to the OpenAI API
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "dall-e-3", // Using DALL-E 3 for better quality
        prompt: prompt,
        n: 1, // Generate one image
        size: "1024x1024", // Standard size
        response_format: "url", // Get a URL rather than base64
        quality: "standard",
        // Include the original image as a reference
        reference_image: base64Data,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      return {
        success: false,
        error: errorData.error?.message || `API error: ${response.status} ${response.statusText}`,
      };
    }

    const data = await response.json();

    // Extract the image URL from the response
    const imageUrl = data.data?.[0]?.url;

    if (!imageUrl) {
      return {
        success: false,
        error: "No image was generated",
      };
    }

    return {
      success: true,
      imageUrl,
    };
  } catch (error) {
    console.error('Error generating visualization:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
