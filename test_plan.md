# Test Plan for Home Screen Visualizer

This document outlines the manual test scenarios for the Home Screen Visualizer application.

## Test Scenarios

### VP-01: Basic Image Upload and Visualization

**Objective:** Verify that users can upload an image and generate a visualization with screens.

**Prerequisites:**
- Application is running
- User has a valid image file (JPEG, PNG) of a house with windows

**Steps:**
1. Navigate to the home page
2. Click the "Upload Image" button
3. Select a valid image file
4. Verify that the image preview appears
5. Click the "Generate Visualization" button
6. Verify that the loading indicator appears
7. Verify that the generated image with screens appears
8. Verify that the "Download Result" button appears
9. Click the "Download Result" button
10. Verify that the image is downloaded

**Expected Results:**
- Image is uploaded and previewed correctly
- Visualization is generated and displayed
- Image can be downloaded

### VP-02: Screen Area Selection

**Objective:** Verify that users can select specific areas for screen visualization.

**Prerequisites:**
- Application is running
- User has a valid image file (JPEG, PNG) of a house with windows

**Steps:**
1. Navigate to the home page
2. Upload a valid image
3. Click and drag to select a window area
4. Verify that the selected area is highlighted
5. Select multiple window areas
6. Verify that the count of selected areas is displayed correctly
7. Click the "Generate Visualization" button
8. Verify that the visualization is generated with screens in the selected areas

**Expected Results:**
- Areas can be selected and highlighted
- Multiple areas can be selected
- Area count is displayed correctly
- Visualization is generated with screens in the selected areas

### VP-03: Input Validation

**Objective:** Verify that the application validates user inputs correctly.

**Prerequisites:**
- Application is running

**Steps:**
1. Try to upload an invalid file type (e.g., text file)
2. Verify that an error message is displayed
3. Try to upload a file that exceeds the size limit
4. Verify that an error message is displayed
5. Try to generate a visualization without uploading an image
6. Verify that the generate button is disabled or an error message is displayed

**Expected Results:**
- Error messages are displayed for invalid inputs
- Generate button is disabled when no image is uploaded

### VP-04: Error Handling

**Objective:** Verify that the application handles errors gracefully.

**Prerequisites:**
- Application is running
- User has a valid image file

**Steps:**
1. Upload a valid image
2. Simulate a network error (e.g., disconnect from the internet)
3. Click the "Generate Visualization" button
4. Verify that an appropriate error message is displayed
5. Reconnect to the internet
6. Try again and verify that the visualization is generated

**Expected Results:**
- Error messages are displayed when network errors occur
- Application recovers gracefully when the network is restored

### VP-05: Real AI Visualization Test

**Objective:** Verify that the AI service generates realistic screen visualizations.

**Prerequisites:**
- Application is running with a valid API key
- User has a valid image file of a house with windows

**Steps:**
1. Upload a high-quality image of a house with windows
2. Select specific window areas
3. Generate a visualization
4. Evaluate the quality and realism of the generated screens
5. Try with different images and window types

**Expected Results:**
- AI generates realistic screen visualizations
- Screens are properly aligned with the selected window areas
- Screens look natural and match the style of the house

### VP-06: AI API Error Handling

**Objective:** Verify that the application handles AI API errors gracefully.

**Prerequisites:**
- Application is running
- User has a valid image file

**Steps:**
1. Upload a valid image
2. Simulate an API key error (e.g., use an invalid API key)
3. Click the "Generate Visualization" button
4. Verify that an appropriate error message is displayed
5. Simulate other API errors (e.g., rate limit exceeded)
6. Verify that appropriate error messages are displayed

**Expected Results:**
- Specific error messages are displayed for different API errors
- User is guided on how to resolve the issues

## Test Results

| Test ID | Date       | Tester | Result | Notes |
|---------|------------|--------|--------|-------|
| VP-01   |            |        |        |       |
| VP-02   |            |        |        |       |
| VP-03   |            |        |        |       |
| VP-04   |            |        |        |       |
| VP-05   |            |        |        |       |
| VP-06   |            |        |        |       |
