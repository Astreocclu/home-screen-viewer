import { NextRequest, NextResponse } from "next/server";
import { generateVisualization, ScreenArea } from "@/lib/aiService";

/**
 * API route for generating visualizations of houses with screens
 * This route handles the POST request from the client and calls the AI service
 */
export async function POST(request: NextRequest) {
  try {
    // Get the API key from environment variables
    const apiKey = process.env.AI_API_KEY;

    // Check if API key is available
    if (!apiKey) {
      console.error("AI_API_KEY is not set in environment variables");
      return NextResponse.json(
        { error: "Server configuration error: API key not available" },
        { status: 500 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { originalImageBase64, screenAreas } = body;

    // Validate required fields
    if (!originalImageBase64) {
      return NextResponse.json(
        { error: "Original image is required" },
        { status: 400 }
      );
    }

    // Validate image format
    if (!originalImageBase64.startsWith("data:image/")) {
      return NextResponse.json(
        { error: "Invalid image format. Expected a data URL starting with 'data:image/'" },
        { status: 400 }
      );
    }

    // Validate screen areas if provided
    if (screenAreas && !Array.isArray(screenAreas)) {
      return NextResponse.json(
        { error: "Screen areas must be an array" },
        { status: 400 }
      );
    }

    // Call the AI service to generate the visualization
    console.log(`Generating visualization with ${screenAreas?.length || 0} screen areas`);
    const result = await generateVisualization({
      originalImageBase64,
      screenAreas: screenAreas as ScreenArea[],
      apiKey,
    });

    // Handle unsuccessful generation
    if (!result.success) {
      console.error("Visualization generation failed:", result.error);
      return NextResponse.json(
        { error: result.error || "Failed to generate visualization" },
        { status: 500 }
      );
    }

    // Return the generated image URL
    console.log("Visualization generated successfully");
    return NextResponse.json({ imageUrl: result.imageUrl });
  } catch (error) {
    // Handle unexpected errors
    console.error("Error in visualization API:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
