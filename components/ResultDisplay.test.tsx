import { render, screen } from '@testing-library/react';
import ResultDisplay from './ResultDisplay';

describe('ResultDisplay', () => {
  const mockOriginalImageUrl = 'https://example.com/original.jpg';
  const mockGeneratedImageUrl = 'https://example.com/generated.jpg';

  it('renders the component with original image only', () => {
    render(
      <ResultDisplay
        originalImageUrl={mockOriginalImageUrl}
        generatedImageUrl={null}
        isLoading={false}
        error={null}
      />
    );

    // Check if title is rendered
    const title = screen.getByText(/results/i);
    expect(title).toBeInTheDocument();

    // Check if original image section is rendered
    const originalImageHeading = screen.getByText(/original image/i);
    expect(originalImageHeading).toBeInTheDocument();

    // Check if original image is rendered
    const originalImage = screen.getByAltText(/original house image/i);
    expect(originalImage).toBeInTheDocument();
    expect(originalImage).toHaveAttribute('src', mockOriginalImageUrl);

    // Check if generated image section is rendered
    const generatedImageHeading = screen.getByText(/with screens/i);
    expect(generatedImageHeading).toBeInTheDocument();

    // Check if placeholder is shown when no generated image
    const placeholder = screen.getByText(/visualization will appear here/i);
    expect(placeholder).toBeInTheDocument();

    // Download button should not be present
    const downloadButton = screen.queryByText(/download result/i);
    expect(downloadButton).not.toBeInTheDocument();
  });

  it('renders loading state correctly', () => {
    render(
      <ResultDisplay
        originalImageUrl={mockOriginalImageUrl}
        generatedImageUrl={null}
        isLoading={true}
        error={null}
      />
    );

    // Check if loading indicator is shown
    const loadingIndicator = screen.getByText(/loading/i);
    expect(loadingIndicator).toBeInTheDocument();

    // Placeholder should not be shown during loading
    const placeholder = screen.queryByText(/visualization will appear here/i);
    expect(placeholder).not.toBeInTheDocument();

    // Original image should still be visible during loading
    const originalImage = screen.getByAltText(/original house/i);
    expect(originalImage).toBeInTheDocument();

    // Download button should not be present during loading
    const downloadButton = screen.queryByText(/download result/i);
    expect(downloadButton).not.toBeInTheDocument();
  });

  it('renders generated image when available', () => {
    render(
      <ResultDisplay
        originalImageUrl={mockOriginalImageUrl}
        generatedImageUrl={mockGeneratedImageUrl}
        isLoading={false}
        error={null}
      />
    );

    // Check if generated image is rendered
    const generatedImage = screen.getByAltText(/house with screens visualization/i);
    expect(generatedImage).toBeInTheDocument();
    expect(generatedImage).toHaveAttribute('src', mockGeneratedImageUrl);

    // Check if download button is rendered
    const downloadButton = screen.getByText(/download result/i);
    expect(downloadButton).toBeInTheDocument();
    expect(downloadButton).toHaveAttribute('href', mockGeneratedImageUrl);
    expect(downloadButton).toHaveAttribute('download', 'house-with-screens.jpg');
  });

  it('renders error message when there is an error', () => {
    const mockError = 'Failed to generate visualization';

    render(
      <ResultDisplay
        originalImageUrl={mockOriginalImageUrl}
        generatedImageUrl={null}
        isLoading={false}
        error={mockError}
      />
    );

    // Check if error message is rendered
    const errorAlert = screen.getByRole('alert');
    expect(errorAlert).toBeInTheDocument();
    expect(errorAlert).toHaveTextContent(/error/i);
    expect(errorAlert).toHaveTextContent(mockError);
  });

  it('verifies download link attributes', () => {
    render(
      <ResultDisplay
        originalImageUrl={mockOriginalImageUrl}
        generatedImageUrl={mockGeneratedImageUrl}
        isLoading={false}
        error={null}
      />
    );

    // Find the download link
    const downloadLink = screen.getByText(/download result/i);

    // Verify link attributes
    expect(downloadLink).toHaveAttribute('href', mockGeneratedImageUrl);
    expect(downloadLink).toHaveAttribute('download');
    expect(downloadLink).toHaveAttribute('target', '_blank');
    expect(downloadLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
