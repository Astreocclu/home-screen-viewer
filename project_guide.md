Project Guide: Home Previewer Application
Welcome to the Home Previewer project! This guide provides detailed information about the project setup, architecture, development workflow, and best practices.

1. Project Goal
The primary objective is to build a web application using Next.js and Tailwind CSS that allows users to:

Upload an image of a house.

(Optionally) Specify areas for screen installation.

Trigger a backend process that uses an external AI image generation/editing API.

View a "before" and "after" visualization showing the house with screens rendered onto it.

2. Tech Stack
Framework: Next.js 15.3.0+ (App Router)

Language: TypeScript

Styling: Tailwind CSS 4

UI Library: React 19

Linting/Formatting: ESLint (Flat Config), Prettier (integrated via ESLint recommended)

Package Manager: npm

External AI API: [Specify the chosen API here, e.g., OpenAI DALL-E Edits API]

3. Project Structure Overview
The project follows the standard Next.js App Router structure:

/
├── app/                  # Main application routes, layouts, pages, API routes
│   ├── api/              # Server-side API endpoints (if using API Routes)
│   ├── (components)/     # UI components specific to routes (optional grouping)
│   └── globals.css       # Base global styles, Tailwind directives
│   └── layout.tsx        # Root layout
│   └── page.tsx          # Root page component
├── components/           # Shared, reusable UI components (e.g., Button, ImageUploader)
├── lib/ or utils/        # Utility functions, helper classes (e.g., AI API client logic)
├── public/               # Static assets (images, fonts)
├── .env.local            # Local environment variables (API Keys - DO NOT COMMIT)
├── .env.example          # Example environment file structure (Commit this)
├── .gitignore            # Specifies intentionally untracked files (includes .env.local)
├── eslint.config.mjs     # ESLint configuration
├── next.config.ts        # Next.js configuration
├── package.json          # Project dependencies and scripts
├── postcss.config.mjs    # PostCSS configuration (for Tailwind)
├── README.md             # Quick start guide, points to this document
├── PROJECT_GUIDE.md      # This detailed guide
└── tsconfig.json         # TypeScript configuration

4. Setup Instructions
Clone Repository:

git clone <repository-url>
cd Home-previewer

Install Dependencies:

npm install

Set Up Environment Variables:

Create a file named .env.local in the project root.

Add the necessary environment variables. Start with the key for the chosen AI API:

# .env.local
AI_API_KEY=your_actual_api_key_here
# Add other variables as needed (e.g., specific model IDs)

IMPORTANT: Ensure .env.local is listed in your .gitignore file. Never commit API keys or other secrets.

Consider creating a .env.example file listing the required variables without their values, and commit that file to help other developers.

Run Development Server:

npm run dev

The application should be accessible at http://localhost:3000.

5. Development Workflow
Branching:

Use feature branches (e.g., feat/image-upload, fix/api-error-handling) branched off main or develop.

Keep branches focused on a single task or feature.

Commits: Write clear, concise commit messages describing the changes made.

Pull Requests (PRs):

Push feature branches to the remote repository.

Open Pull Requests to merge changes into main or develop.

Require at least one review before merging (if collaborating).

Ensure linting (npm run lint) and build (npm run build) pass before merging.

Code Style: Adhere strictly to the ESLint (eslint.config.mjs) and Prettier rules configured in the project. Run npm run lint -- --fix periodically.

6. Core Implementation Phases (Overview)
This outlines the major stages of development:

Phase 0: Foundation: Setup project, environment variables, basic structure (Largely complete with the skeleton).

Phase 1: Frontend - Image Input: Develop components for image upload (<input type="file">) and preview. Style with Tailwind.

Phase 2: Backend - API Handling: Create API Route or Server Action (/app/api/visualize or visualizeAction) to receive image data. Implement secure AI API key handling.

Phase 3: AI Integration: Implement logic within the backend handler to:

Prepare the image for the chosen AI API.

Construct the appropriate prompt (including screen specifications).

Call the external AI API.

Handle the response (success/error, retrieving the generated image).

Phase 4: Frontend - Result Display: Develop components to display the original and AI-generated images side-by-side. Handle loading states and error feedback.

Phase 5: Refinement & Testing: Improve UX, add detailed error handling, perform manual testing across browsers/devices, potentially add automated tests.

7. Coding Best Practices
Modularity:

Break down UI into small, reusable React components (/components).

Isolate server-side logic in API Routes or Server Actions.

Create helper functions/classes for distinct functionalities (e.g., AI API interaction in /lib/aiService.ts).

Naming: Use clear, descriptive names for files, variables, functions, components, etc. Follow TypeScript/JavaScript conventions.

Comments: Add comments to explain non-obvious logic, complex algorithms, API interactions, or // TODO: notes.

Logging: Implement server-side (console.log or a library) and client-side (console.log) logging for debugging key events (requests, API calls, errors).

Error Handling: Use try...catch for async operations. Provide user-friendly error messages on the frontend and log detailed errors on the backend. Handle potential API errors gracefully.

Security:

API Key Protection: Top priority. Use environment variables (.env.local) accessed ONLY server-side.

Validate user inputs (file types, sizes).

TypeScript: Leverage strong typing. Avoid any where possible. Use interfaces and types for data structures (API requests/responses).

Tailwind CSS: Use utility classes directly. Avoid custom CSS unless necessary. Keep globals.css minimal.

Environment Variables: Use .env.local for all secrets and environment-specific configurations.

8. Agentic AI Guidelines (For Potential Automation/Assistance)
If using an AI assistant for coding tasks:

Context: Ensure it's aware of the tech stack, project structure, and file locations.

Specificity: Provide clear, specific instructions for tasks (e.g., "Create a React component named 'ImagePreview' in /components that accepts an image URL prop and displays the image using next/image").

Security: Explicitly instruct it never to hardcode API keys or secrets. Remind it to use process.env.AI_API_KEY in server-side code.

Style Adherence: Instruct it to follow the ESLint/Prettier rules and use Tailwind CSS utilities.

File Operations: Be cautious with instructions that modify or delete files. Review generated code carefully.

9. Key Decisions Log
AI API: [Specify Chosen API Here]

Screen Placement Method (v1): [Specify Method Here - e.g., "AI Auto-Detect via Prompt"]

State Management (if needed beyond basic React state): [Specify Library/Method Here, e.g., "React Context", "Zustand"]

(Keep this section updated as major architectural or technical decisions are made.)
