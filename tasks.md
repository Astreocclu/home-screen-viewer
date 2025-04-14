# Agent Instructions: Prepare Feature Branches for Senior Engineer Review

**Goal:** Perform final checks, updates, and packaging for one or more feature branches before they are merged, to facilitate review by senior engineers.

**Context:** The project is a Next.js application ("Home Previewer") using TypeScript, Tailwind CSS, Jest, and ESLint. Core functionality involves image upload and AI-based visualization via DALL-E 3. Feature branches likely follow conventions like `test/automated-tests`, `test/manual-test-scenarios`, `test/post-ai-implementation` (refer to `tasks.md`), but you will need the exact name(s).

---

## Task 1: Feature Branch Preparation

**Objective:** Ensure you are working on the correct, up-to-date feature branch.

* **1.1. Identify Branch:** Determine the exact name of the first feature branch requiring review (e.g., `test/post-ai-implementation`).
    * **Input:** Feature branch name.
* **1.2. Checkout Branch:** Switch your local repository to the specified feature branch.
    * **Command:** `git checkout <feature_branch_name>`
    * **Expected Output:** Git confirms checkout to the branch.
* **1.3. Update Branch:** Pull the latest changes from the remote repository for this branch to ensure you have the most recent code.
    * **Command:** `git pull origin <feature_branch_name>`
    * **Expected Output:** Git confirms the branch is up-to-date or fetches new changes.
* **1.4. Install Dependencies:** Ensure all dependencies are correctly installed.
    * **Command:** `npm install`
    * **Expected Output:** npm completes installation without errors.

---

## Task 2: Local Verification & Validation

**Objective:** Run all checks to ensure code quality, functionality, and build success on the feature branch.

* **2.1. Verify UI Component Files:**
    * **Action:** Check for the existence and review the content of key UI components: `ImageUploader.tsx`, `ScreenAreaSelector.tsx`, `ResultDisplay.tsx`. (Verify their exact location, likely within `Home-previewer (copy)/app/components/` or similar).
    * **Expected Output:** Confirmation that files exist and appear complete. Note the verified path.
* **2.2. Run Linting:** Check for code style issues.
    * **Command:** `npm run lint`
    * **Expected Output:** Command finishes successfully, ideally with no errors. Document any errors found.
* **2.3. Investigate Lint Report Generation:**
    * **Action:** Examine the `Home-previewer (copy)/eslint_report.json` file. If it's empty (as previously observed), investigate why `npm run lint:report` might not be generating content. Check the script definition in `Home-previewer (copy)/package.json` and the ESLint configuration in `Home-previewer (copy)/eslint.config.mjs`.
    * **Expected Output:** An understanding of the ESLint report status (e.g., "Report generation fixed", "Report intentionally empty due to no errors", "Investigation needed for report generation"). Fix if possible.
* **2.4. Run Automated Tests:** Execute the test suite.
    * **Command:** `npm run test`
    * **Expected Output:** All tests pass. Document any failures.
* **2.5. Run Production Build:** Simulate a production build.
    * **Command:** `npm run build`
    * **Expected Output:** Build completes successfully without errors.
* **2.6. Run Locally & Manual Spot Check:** Start the development server and perform a quick manual test.
    * **Command:** `npm run dev`
    * **Action:** Open the application in a browser. Test the core workflow: upload an image, select a screen area, submit, and view the result. Check for console errors.
    * **Expected Output:** Core workflow functions as expected locally. Stop the server (`Ctrl+C`) after checking.
* **2.7. Resolve Issues:** If any checks (lint, test, build, manual spot check) fail or reveal issues, address them now.

---

## Task 3: Documentation Update

**Objective:** Ensure all relevant documentation accurately reflects the state of the code on this feature branch.

* **3.1. Update README:** Review
