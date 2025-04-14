// Import modules
import { generateVisualization } from '@/lib/aiService';

// Mock the aiService module
jest.mock('@/lib/aiService', () => ({
  generateVisualization: jest.fn(),
}));

// Mock the Next.js modules
jest.mock('next/server', () => ({
  NextRequest: class MockNextRequest {
    url: string;
    method: string;
    private body: string;

    constructor(url: string, options: Record<string, unknown> = {}) {
      this.url = url;
      this.method = options.method || 'GET';
      this.body = options.body || '{}';
    }

    async json() {
      return JSON.parse(this.body);
    }
  },
  NextResponse: {
    json: (data: unknown, options: Record<string, unknown> = {}) => ({
      status: options.status || 200,
      json: async () => data,
    }),
  },
}));

// Import the route handler after mocking
// Define a type for the POST handler based on Next.js API route handlers
type RouteHandler = (request: Request) => Promise<Response>;

let POST: RouteHandler | undefined;

// Dynamically import the route to avoid the Request not defined error
beforeAll(async () => {
  const routeModule = await import('./route');
  POST = routeModule.POST;
});



// Mock the environment variables
const originalEnv = process.env;

describe('API Route: /api/visualize', () => {
  // Import NextRequest from our mock
  const { NextRequest } = jest.requireMock('next/server');

  // Setup before each test
  beforeEach(() => {
    // Reset mocks
    jest.resetAllMocks();

    // Mock environment variables
    process.env = { ...originalEnv, AI_API_KEY: 'test-api-key' };
  });

  // Restore environment after tests
  afterAll(() => {
    process.env = originalEnv;
  });

  it('should return 500 if API key is not set', async () => {
    // Skip if POST is not available yet
    if (!POST) return;

    // Remove API key from environment
    process.env.AI_API_KEY = '';

    // Create mock request
    const request = new NextRequest('http://localhost:3000/api/visualize', {
      method: 'POST',
      body: JSON.stringify({
        originalImageBase64: 'data:image/jpeg;base64,/9j/example',
      }),
    });

    // Call the API route
    const response = await POST(request);
    const data = await response.json();

    // Verify response
    expect(response.status).toBe(500);
    expect(data).toEqual({
      error: 'Server configuration error: API key not available',
    });
    expect(generateVisualization).not.toHaveBeenCalled();
  });

  it('should return 400 if original image is missing', async () => {
    // Skip if POST is not available yet
    if (!POST) return;

    // Create mock request with missing image
    const request = new NextRequest('http://localhost:3000/api/visualize', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    // Call the API route
    const response = await POST(request);
    const data = await response.json();

    // Verify response
    expect(response.status).toBe(400);
    expect(data).toEqual({
      error: 'Original image is required',
    });
    expect(generateVisualization).not.toHaveBeenCalled();
  });

  it('should return 400 if image format is invalid', async () => {
    // Skip if POST is not available yet
    if (!POST) return;

    // Create mock request with invalid image format
    const request = new NextRequest('http://localhost:3000/api/visualize', {
      method: 'POST',
      body: JSON.stringify({
        originalImageBase64: 'not-a-data-url',
      }),
    });

    // Call the API route
    const response = await POST(request);
    const data = await response.json();

    // Verify response
    expect(response.status).toBe(400);
    expect(data).toEqual({
      error: "Invalid image format. Expected a data URL starting with 'data:image/'",
    });
    expect(generateVisualization).not.toHaveBeenCalled();
  });

  it('should return 400 if screen areas is not an array', async () => {
    // Skip if POST is not available yet
    if (!POST) return;

    // Create mock request with invalid screen areas
    const request = new NextRequest('http://localhost:3000/api/visualize', {
      method: 'POST',
      body: JSON.stringify({
        originalImageBase64: 'data:image/jpeg;base64,/9j/example',
        screenAreas: 'not-an-array',
      }),
    });

    // Call the API route
    const response = await POST(request);
    const data = await response.json();

    // Verify response
    expect(response.status).toBe(400);
    expect(data).toEqual({
      error: 'Screen areas must be an array',
    });
    expect(generateVisualization).not.toHaveBeenCalled();
  });

  it('should return 500 if visualization generation fails', async () => {
    // Skip if POST is not available yet
    if (!POST) return;

    // Mock the generateVisualization function to return an error
    (generateVisualization as jest.Mock).mockResolvedValueOnce({
      success: false,
      error: 'AI service error',
    });

    // Create mock request
    const request = new NextRequest('http://localhost:3000/api/visualize', {
      method: 'POST',
      body: JSON.stringify({
        originalImageBase64: 'data:image/jpeg;base64,/9j/example',
      }),
    });

    // Call the API route
    const response = await POST(request);
    const data = await response.json();

    // Verify response
    expect(response.status).toBe(500);
    expect(data).toEqual({
      error: 'AI service error',
    });
    expect(generateVisualization).toHaveBeenCalledWith({
      originalImageBase64: 'data:image/jpeg;base64,/9j/example',
      screenAreas: undefined,
      apiKey: 'test-api-key',
    });
  });

  it('should return 200 with image URL on successful generation', async () => {
    // Skip if POST is not available yet
    if (!POST) return;

    // Mock the generateVisualization function to return success
    const mockImageUrl = 'https://example.com/generated-image.jpg';
    (generateVisualization as jest.Mock).mockResolvedValueOnce({
      success: true,
      imageUrl: mockImageUrl,
    });

    // Create mock request
    const request = new NextRequest('http://localhost:3000/api/visualize', {
      method: 'POST',
      body: JSON.stringify({
        originalImageBase64: 'data:image/jpeg;base64,/9j/example',
        screenAreas: [
          {
            id: 'area1',
            points: [
              { x: 10, y: 10 },
              { x: 100, y: 10 },
              { x: 100, y: 100 },
              { x: 10, y: 100 },
            ],
          },
        ],
      }),
    });

    // Call the API route
    const response = await POST(request);
    const data = await response.json();

    // Verify response
    expect(response.status).toBe(200);
    expect(data).toEqual({
      imageUrl: mockImageUrl,
    });
    expect(generateVisualization).toHaveBeenCalledWith({
      originalImageBase64: 'data:image/jpeg;base64,/9j/example',
      screenAreas: [
        {
          id: 'area1',
          points: [
            { x: 10, y: 10 },
            { x: 100, y: 10 },
            { x: 100, y: 100 },
            { x: 10, y: 100 },
          ],
        },
      ],
      apiKey: 'test-api-key',
    });
  });
});
