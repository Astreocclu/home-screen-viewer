# Home Screen Visualizer

This is a Next.js application that allows users to upload images of homes and visualize screens on windows. The application uses AI to generate realistic visualizations of how screens would look on the windows of a home.

This project is built with [Next.js](https://nextjs.org), TypeScript, Tailwind CSS, and integrates with OpenAI's DALL-E 3 for image generation.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the main page, or [http://localhost:3000/test](http://localhost:3000/test) to access the test page with full functionality.

## Features

- **Image Upload**: Upload images of homes in various formats (JPEG, PNG, WebP)
- **Screen Area Selection**: Select window areas on the uploaded image where screens should be visualized
- **AI-Powered Visualization**: Generate realistic visualizations of screens on the selected windows
- **Result Display**: View and compare the original and generated images side by side
- **Download Results**: Download the generated visualization for use in presentations or marketing materials

## Project Structure

- `app/`: Next.js app directory containing pages and API routes
  - `page.tsx`: Main landing page
  - `test/page.tsx`: Test page with full functionality
  - `api/visualize/`: API endpoint for generating visualizations
- `components/`: React components
  - `ImageUploader.tsx`: Component for uploading and previewing images
  - `ScreenAreaSelector.tsx`: Component for selecting screen areas on an image
  - `ResultDisplay.tsx`: Component for displaying the original and generated images
- `lib/`: Utility functions and services
  - `aiService.ts`: Service for interacting with the AI API
  - `imageUtils.ts`: Utility functions for image handling

## Environment Variables

The application requires the following environment variables:

- `AI_API_KEY`: Your OpenAI API key for DALL-E 3 access

Create a `.env.local` file in the root directory with these variables or provide them through the UI on the test page.

## Testing

The application includes comprehensive tests for all components and utilities. Run the tests with:

```bash
npm test
```

## Linting

Lint the codebase with:

```bash
npm run lint
```

Generate a lint report with:

```bash
npm run lint:report
```

## Building for Production

Create a production build with:

```bash
npm run build
```

## Deployment

The application can be deployed on Vercel or any other platform that supports Next.js applications.

```bash
npm run build
npm run start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
