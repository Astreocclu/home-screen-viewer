# Agent Instructions: Merge Branches and Push to New Private Repository

**Goal:** Follow the senior engineer's instructions to push the finalized feature branch to GitHub and prepare for the creation of a Pull Request (PR) for code review.

**Context:** The relevant feature branch should have already been validated (linted, tested, built) and updated according to the "Prepare Feature Branches for Senior Engineer Review" instructions.

---

## Task 1: Final Branch Confirmation

**Objective:** Ensure you are on the correct branch that contains the complete, validated work ready for review.

* **1.1. Identify Final Branch:** Determine the exact name of the feature branch that incorporates all the work intended for this review cycle (e.g., `test/post-ai-implementation` or potentially an integration branch if features were merged locally).
    * **Input:** Final feature branch name.
* **1.2. Checkout Branch:** Switch your local repository to this final feature branch.
    * **Command:** `git checkout <final_branch_name>`
    * **Expected Output:** Git confirms checkout to the branch.
* **1.3. Verify Status:** Check that there are no uncommitted changes on the branch.
    * **Command:** `git status`
    * **Expected Output:** Status indicates the working tree is clean and the branch is up-to-date with the last commit. If not clean, commit any remaining necessary changes.

---

## Task 2: Push Final Branch to GitHub

**Objective:** Ensure the remote repository (GitHub) has the latest version of the feature branch.

* **2.1. Push Branch:** Push the current state of your local final feature branch to the corresponding branch on the remote repository (`origin`). Use `--set-upstream` if this is the first time pushing this branch.
    * **Command (first time push):** `git push --set-upstream origin <final_branch_name>`
    * **Command (subsequent pushes):** `git push origin <final_branch_name>`
    * **Expected Output:** Git confirms successful push to the remote repository.
    * **Error Handling:** If push fails, diagnose using `git status`, check repository permissions, or network connectivity.

---

## Task 3: Prepare Pull Request Information

**Objective:** Collate the necessary information required to manually create the Pull Request on the GitHub website. (Note: Automating PR creation might require additional tools like the GitHub CLI (`gh`) which may not be available.)

* **3.1. Identify Target Branch:** Confirm the target branch for the merge (as per engineer's instruction).
    * **Value:** `main`
* **3.2. Identify Source Branch:** Confirm the source branch (the one you just pushed).
    * **Value:** `<final_branch_name>` (Use the actual name from Task 1.1)
* **3.3. Prepare Title:** Formulate a concise and descriptive title for the Pull Request.
    * **Example Title:** `feat: Implement Home Previewer Visualization Feature` (Adjust as needed)
* **3.4. Prepare Body:** Formulate a body for the Pull Request. Reference previous review notes and summarize the changes.
    * **Example Body:**
        ```
        Implements the core functionality for the Home Previewer application as outlined in tasks.md.

        Key Features:
        - Image upload and validation (`ImageUploader`, `imageUtils.ts`)
        - Screen area selection (`ScreenAreaSelector`)
        - AI-powered visualization via DALL-E 3 (`aiService.ts`, `/api/visualize`)
        - Result display (`ResultDisplay`)

        Testing:
        - Automated tests (unit, integration, component) implemented and passing (see testing_summary.md).
        - Manual testing completed (see test_results.md).
        - Post-AI testing completed (see post_ai_test_results.md).

        See `REVIEW_NOTES_<final_branch_name>.md` for detailed pre-review validation checks and notes.

        Closes #[Issue Number] (if applicable)
        ```
        (Adjust based on actual implementation and documentation).

---

## Task 4: Report Information for Manual PR Creation

**Objective:** Output the collected information so the user can create the Pull Request on GitHub.

* **4.1. Confirm Push:** State whether the push in Task 2 was successful.
* **4.2. Output PR Details:** Clearly print the information gathered in Task 3.
    * **Output Format:**
        ```
        Pull Request Details for Manual Creation on GitHub:
        --------------------------------------------------
        Repository: [Your Repository Name/URL]
        Base Branch (Target): main
        Compare Branch (Source): <final_branch_name>
        Suggested Title: [Title from Task 3.3]
        Suggested Body:
        ---
        [Body from Task 3.4]
        ---

        Action Required: Please navigate to the repository on GitHub, go to the 'Pull requests' tab, click 'New pull request', select the branches above, fill in the title and body, and click 'Create pull request'. This will trigger automated tests and allow the senior engineer to review the diff.
        ```

---

## Original Task Instructions: Prepare Feature Branches for Senior Engineer Review

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

* **3.1. Update README:** Review and update the README.md file to ensure it accurately reflects the current state of the project.
