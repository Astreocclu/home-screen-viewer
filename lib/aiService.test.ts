import { generateVisualization, ScreenArea } from './aiService';

// Mock the global fetch function
global.fetch = jest.fn();

describe('aiService', () => {
  // Sample data for testing
  const validImageBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKKKAP/2Q==';
  const validApiKey = 'test-api-key';
  const sampleScreenAreas: ScreenArea[] = [
    {
      id: 'area1',
      points: [
        { x: 10, y: 10 },
        { x: 100, y: 10 },
        { x: 100, y: 100 },
        { x: 10, y: 100 }
      ]
    }
  ];

  // Reset mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('generateVisualization', () => {
    it('should return error when API key is missing', async () => {
      const result = await generateVisualization({
        originalImageBase64: validImageBase64,
        apiKey: '',
      });

      expect(result).toEqual({
        success: false,
        error: 'API key is required',
      });
      expect(fetch).not.toHaveBeenCalled();
    });

    it('should make correct API call with no screen areas', async () => {
      // Mock successful API response
      const mockResponse = {
        data: [{ url: 'https://example.com/generated-image.jpg' }]
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse)
      });

      const result = await generateVisualization({
        originalImageBase64: validImageBase64,
        apiKey: validApiKey,
      });

      // Verify the API was called with correct parameters
      expect(fetch).toHaveBeenCalledWith('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${validApiKey}`,
        },
        body: expect.any(String),
      });

      // Parse the request body to verify its contents
      const requestBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(requestBody.model).toBe('dall-e-3');
      expect(requestBody.prompt).toContain('Add window screens to all visible windows');
      expect(requestBody.n).toBe(1);
      expect(requestBody.size).toBe('1024x1024');
      expect(requestBody.response_format).toBe('url');
      expect(requestBody.quality).toBe('standard');
      expect(requestBody.reference_image).toBeDefined();

      // Verify the result
      expect(result).toEqual({
        success: true,
        imageUrl: 'https://example.com/generated-image.jpg',
      });
    });

    it('should make correct API call with screen areas', async () => {
      // Mock successful API response
      const mockResponse = {
        data: [{ url: 'https://example.com/generated-image.jpg' }]
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse)
      });

      const result = await generateVisualization({
        originalImageBase64: validImageBase64,
        screenAreas: sampleScreenAreas,
        apiKey: validApiKey,
      });

      // Verify the API was called with correct parameters
      expect(fetch).toHaveBeenCalledWith('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${validApiKey}`,
        },
        body: expect.any(String),
      });

      // Parse the request body to verify its contents
      const requestBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(requestBody.model).toBe('dall-e-3');
      expect(requestBody.prompt).toContain('Add window screens to the specific areas');
      expect(requestBody.prompt).toContain('1 marked areas');
      expect(requestBody.n).toBe(1);
      expect(requestBody.size).toBe('1024x1024');
      expect(requestBody.response_format).toBe('url');
      expect(requestBody.quality).toBe('standard');
      expect(requestBody.reference_image).toBeDefined();

      // Verify the result
      expect(result).toEqual({
        success: true,
        imageUrl: 'https://example.com/generated-image.jpg',
      });
    });

    it('should handle API error responses', async () => {
      // Mock error API response
      const errorMessage = 'Invalid API key';
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: jest.fn().mockResolvedValueOnce({
          error: { message: errorMessage }
        })
      });

      const result = await generateVisualization({
        originalImageBase64: validImageBase64,
        apiKey: 'invalid-key',
      });

      // Verify the result contains the error
      expect(result).toEqual({
        success: false,
        error: errorMessage,
      });
    });

    it('should handle network errors', async () => {
      // Mock network error
      const networkError = new Error('Network error');
      (fetch as jest.Mock).mockRejectedValueOnce(networkError);

      const result = await generateVisualization({
        originalImageBase64: validImageBase64,
        apiKey: validApiKey,
      });

      // Verify the result contains the error
      expect(result).toEqual({
        success: false,
        error: 'Network error',
      });
    });

    it('should handle missing image URL in response', async () => {
      // Mock response with missing image URL
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({
          data: [{ /* No URL */ }]
        })
      });

      const result = await generateVisualization({
        originalImageBase64: validImageBase64,
        apiKey: validApiKey,
      });

      // Verify the result contains the error
      expect(result).toEqual({
        success: false,
        error: 'No image was generated',
      });
    });

    it('should handle invalid image data URL format', async () => {
      // Test with invalid data URL
      const result = await generateVisualization({
        originalImageBase64: 'not-a-data-url',
        apiKey: validApiKey,
      });

      // Verify the result contains the error
      expect(result).toEqual({
        success: false,
        error: 'Invalid data URL format',
      });
      expect(fetch).not.toHaveBeenCalled();
    });

    it('should handle empty response from API', async () => {
      // Mock empty API response
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({})
      });

      const result = await generateVisualization({
        originalImageBase64: validImageBase64,
        apiKey: validApiKey,
      });

      // Verify the result contains the error
      expect(result).toEqual({
        success: false,
        error: 'No image was generated',
      });
    });

    it('should handle malformed JSON response', async () => {
      // Mock API response with invalid JSON
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockRejectedValueOnce(new Error('Invalid JSON'))
      });

      const result = await generateVisualization({
        originalImageBase64: validImageBase64,
        apiKey: validApiKey,
      });

      // Verify the result contains the error
      expect(result).toEqual({
        success: false,
        error: 'Invalid JSON',
      });
    });

    it('should handle multiple screen areas correctly', async () => {
      // Mock successful API response
      const mockResponse = {
        data: [{ url: 'https://example.com/generated-image.jpg' }]
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse)
      });

      // Create multiple screen areas
      const multipleScreenAreas: ScreenArea[] = [
        {
          id: 'area1',
          points: [
            { x: 10, y: 10 },
            { x: 100, y: 10 },
            { x: 100, y: 100 },
            { x: 10, y: 100 }
          ]
        },
        {
          id: 'area2',
          points: [
            { x: 200, y: 200 },
            { x: 300, y: 200 },
            { x: 300, y: 300 },
            { x: 200, y: 300 }
          ]
        }
      ];

      const result = await generateVisualization({
        originalImageBase64: validImageBase64,
        screenAreas: multipleScreenAreas,
        apiKey: validApiKey,
      });

      // Parse the request body to verify its contents
      const requestBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(requestBody.prompt).toContain('2 marked areas');

      // Verify the result
      expect(result).toEqual({
        success: true,
        imageUrl: 'https://example.com/generated-image.jpg',
      });
    });
  });
});
