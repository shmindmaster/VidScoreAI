# Testing Guide for VidScoreAI

This guide provides comprehensive instructions for running and maintaining the E2E test suite for VidScoreAI.

## Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Test Scripts](#test-scripts)
- [Running Tests](#running-tests)
- [Mobile Testing](#mobile-testing)
- [Test Reports](#test-reports)
- [Debugging Tests](#debugging-tests)
- [Writing New Tests](#writing-new-tests)
- [CI/CD Integration](#cicd-integration)
- [Best Practices](#best-practices)

---

## Overview

VidScoreAI uses **Playwright** for end-to-end testing with a **mobile-first** approach. The test suite validates:

- ✅ Video Analyzer flow (upload, analysis, reporting)
- ✅ AI Editor flow (multi-file upload, style selection, generation)
- ✅ Navigation and routing
- ✅ Responsive design across devices
- ✅ Mobile usability (touch targets, scrolling)
- ✅ Accessibility basics
- ✅ Cross-browser compatibility

### Test Coverage
- **Total Test Cases**: 44
- **Automated**: 33 (75%)
- **Manual**: 11 (25%)
- **Coverage**: 95%+ of critical user flows

---

## Prerequisites

### Required Software
- **Node.js**: Version 20 or higher
- **npm**: Version 9 or higher (comes with Node.js)
- **Playwright**: Installed via npm (included in devDependencies)

### Installation

```bash
# Clone the repository
git clone https://github.com/shmindmaster/VidScoreAI.git
cd VidScoreAI

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium
```

---

## Quick Start

### Run All Tests

```bash
# Run all E2E tests (all browsers/devices)
npm test
```

This will:
1. Start the Next.js development server
2. Run tests across 8 different device/browser configurations
3. Generate an HTML report

### Run Tests in UI Mode (Recommended for Development)

```bash
npm run test:ui
```

This opens an interactive UI where you can:
- See all tests
- Run individual tests
- Watch tests execute in real-time
- Inspect test steps
- Debug failures

---

## Test Scripts

The following npm scripts are available:

| Script | Command | Description |
|--------|---------|-------------|
| `npm test` | `playwright test` | Run all tests across all devices |
| `npm run test:headed` | `playwright test --headed` | Run tests with visible browser |
| `npm run test:ui` | `playwright test --ui` | Interactive test runner (best for dev) |
| `npm run test:mobile` | Mobile Chrome + Safari | Run mobile device tests only |
| `npm run test:desktop` | Desktop Chrome | Run desktop tests only |
| `npm run test:report` | `playwright show-report` | Open HTML test report |

---

## Running Tests

### Run All Tests (All Devices)

```bash
npm test
```

**Output**: Tests run on:
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)
- Tablet iPad (iPad Pro)
- Desktop Chrome
- Desktop Safari
- Desktop Edge
- Small Mobile (iPhone SE)
- Large Desktop (1920x1080)

### Run Specific Project (Device/Browser)

```bash
# Mobile Chrome only
npx playwright test --project="Mobile Chrome"

# Mobile Safari only
npx playwright test --project="Mobile Safari"

# Desktop Chrome only
npx playwright test --project="Desktop Chrome"

# Tablet iPad only
npx playwright test --project="Tablet iPad"
```

### Run Specific Test File

```bash
# Video Analyzer tests only
npx playwright test e2e/video-analyzer.spec.ts

# AI Editor tests only
npx playwright test e2e/editor.spec.ts

# Navigation tests only
npx playwright test e2e/navigation.spec.ts
```

### Run Specific Test

```bash
# Run test by name
npx playwright test -g "TC-VA-001"

# Run tests matching pattern
npx playwright test -g "hero section"
```

### Run Tests in Headed Mode

```bash
# See browser window during test execution
npx playwright test --headed

# Specific test in headed mode
npx playwright test e2e/video-analyzer.spec.ts --headed
```

---

## Mobile Testing

### Mobile-First Philosophy

All core user flows are tested on **mobile devices first** before desktop validation.

### Mobile Device Coverage

| Device | Viewport | Browser | Priority |
|--------|----------|---------|----------|
| iPhone 12 | 390x844 | Safari | HIGH |
| Pixel 5 | 393x851 | Chrome | HIGH |
| iPhone SE | 375x667 | Safari | MEDIUM |
| iPad Pro | 1024x1366 | Safari | MEDIUM |

### Run Mobile Tests Only

```bash
# Run on both mobile browsers
npm run test:mobile

# Or individually
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
npx playwright test --project="Small Mobile"
```

### Mobile-Specific Checks

Our mobile tests verify:
- ✅ Touch target sizes (minimum 44x44px)
- ✅ No horizontal scroll
- ✅ Text readability without zoom (minimum 16px)
- ✅ Smooth scrolling and animations
- ✅ Navigation accessibility
- ✅ Form usability with virtual keyboard

### Testing on Real Devices

While emulated devices cover most scenarios, periodic testing on real devices is recommended:

1. **iOS (Safari)**:
   - Connect iPhone via USB
   - Enable Web Inspector in Safari settings
   - Use Safari's developer tools

2. **Android (Chrome)**:
   - Enable USB debugging
   - Use Chrome DevTools remote debugging
   - Access via `chrome://inspect`

---

## Test Reports

### HTML Report

After test execution:

```bash
# Open the HTML report
npm run test:report
```

The report shows:
- ✅ All test results (passed/failed)
- 📊 Test duration and statistics
- 📸 Screenshots on failure
- 🎥 Video recordings (on failure)
- 📋 Detailed test steps

### Report Location

```
playwright-report/index.html
```

### CI/CD Reports

In CI environments, reports are automatically generated and can be:
- Uploaded as artifacts
- Viewed in GitHub Actions
- Integrated with test reporting tools

---

## Debugging Tests

### Interactive Debugging (UI Mode)

```bash
# Best way to debug tests
npm run test:ui
```

**Features**:
- Watch tests run step-by-step
- Inspect DOM at each step
- Time-travel through test execution
- See console logs
- View network requests

### Debug Mode

```bash
# Run specific test with debugger
npx playwright test e2e/video-analyzer.spec.ts --debug
```

This opens:
- Browser window
- Playwright Inspector
- Step-by-step execution controls

### Add Debug Points in Tests

```typescript
// Add pause in test
await page.pause();

// Take screenshot for inspection
await page.screenshot({ path: 'debug-screenshot.png' });

// Console log for debugging
console.log(await page.title());
```

### View Screenshots and Videos

Failed tests automatically capture:

```
test-results/
├── screenshots/
│   └── test-name-failure.png
└── videos/
    └── test-name-failure.webm
```

### Verbose Output

```bash
# See detailed logs
npx playwright test --reporter=list

# Even more verbose
DEBUG=pw:api npx playwright test
```

---

## Writing New Tests

### Test File Structure

Create new test files in `/e2e/` directory:

```
e2e/
├── video-analyzer.spec.ts    # Video Analyzer flow tests
├── editor.spec.ts             # AI Editor flow tests
├── navigation.spec.ts         # Navigation and layout tests
└── your-new-feature.spec.ts   # New feature tests
```

### Basic Test Template

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('TC-XXX-001: Test description', async ({ page }) => {
    // Navigate to page
    await page.goto('/');

    // Perform actions
    await page.getByRole('button', { name: 'Click Me' }).click();

    // Assert expectations
    await expect(page.getByText('Success')).toBeVisible();
  });
});
```

### Mobile-Specific Tests

```typescript
import { test, expect, devices } from '@playwright/test';

test.describe('Mobile Feature', () => {
  test.use({ ...devices['iPhone 12'] });

  test('Mobile-specific test', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'This test is for mobile only');
    
    await page.goto('/');
    
    // Mobile-specific assertions
    if (isMobile) {
      const button = page.getByRole('button');
      const box = await button.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
  });
});
```

### Best Practices for Test Writing

1. **Use Semantic Selectors**
   ```typescript
   // ✅ Good - semantic
   await page.getByRole('button', { name: 'Submit' });
   await page.getByText('Welcome');
   
   // ❌ Bad - brittle
   await page.locator('.css-class-xyz');
   await page.locator('#id-123');
   ```

2. **Wait for Elements**
   ```typescript
   // ✅ Good - wait for visibility
   await expect(page.getByText('Loaded')).toBeVisible();
   
   // ❌ Bad - no waiting
   expect(await page.getByText('Loaded').isVisible()).toBe(true);
   ```

3. **Use Test IDs for Complex Selectors**
   ```typescript
   // Add data-testid to component
   <button data-testid="submit-button">Submit</button>
   
   // Use in test
   await page.getByTestId('submit-button').click();
   ```

4. **Clean Up Test Data**
   ```typescript
   test.afterEach(async ({ page }) => {
     // Reset state or clean up
   });
   ```

---

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/test.yml`:

```yaml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          
      - name: Install dependencies
        run: npm ci
        
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps chromium
        
      - name: Run Playwright tests
        run: npm test
        
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

### Environment Variables

Set in CI environment:

```bash
# For CI optimization
CI=true

# Custom base URL (if needed)
BASE_URL=https://staging.vidscoreai.com
```

### Running Subset of Tests in CI

```yaml
# Fast smoke tests
- name: Smoke Tests
  run: npx playwright test --project="Mobile Chrome" --project="Desktop Chrome"

# Full suite
- name: Full E2E Tests
  run: npm test
```

---

## Best Practices

### Test Maintenance

1. **Keep Tests Independent**
   - Each test should run independently
   - Don't rely on test execution order
   - Clean up state between tests

2. **Use Fixtures and Helpers**
   ```typescript
   // Create reusable helpers
   async function navigateToReport(page) {
     await page.goto('/');
     // ... upload steps
   }
   
   test('Test using helper', async ({ page }) => {
     await navigateToReport(page);
     // Continue test
   });
   ```

3. **Avoid Hardcoded Waits**
   ```typescript
   // ❌ Bad
   await page.waitForTimeout(5000);
   
   // ✅ Good
   await expect(page.getByText('Loaded')).toBeVisible({ timeout: 5000 });
   ```

4. **Test Error Paths**
   - Don't just test happy paths
   - Test error handling
   - Test edge cases

5. **Mobile-First Mindset**
   - Test mobile first, then desktop
   - Verify touch targets
   - Check for horizontal scroll
   - Test with throttled network

### Performance

1. **Parallel Execution**
   ```typescript
   // Tests run in parallel by default
   test.describe.configure({ mode: 'parallel' });
   ```

2. **Selective Project Runs**
   ```bash
   # Don't run all browsers every time locally
   npx playwright test --project="Mobile Chrome"
   ```

3. **Skip Unnecessary Tests**
   ```typescript
   test.skip(isMobile, 'Desktop-only test');
   ```

### Debugging Tips

1. **Use UI Mode for Development**
   ```bash
   npm run test:ui
   ```

2. **Run Single Test During Development**
   ```bash
   npx playwright test -g "specific test name"
   ```

3. **Add Console Logs**
   ```typescript
   console.log('Current URL:', page.url());
   ```

4. **Inspect Page State**
   ```typescript
   await page.pause(); // Opens inspector
   ```

---

## Troubleshooting

### Common Issues

#### Issue: Tests Fail Locally but Pass in CI

**Solution**:
- Check viewport size matches
- Verify Node.js version matches CI
- Clear browser cache: `npx playwright install --with-deps`

#### Issue: Timeouts

**Solution**:
```typescript
// Increase timeout for slow operations
test.setTimeout(60000); // 60 seconds

// Or per action
await expect(element).toBeVisible({ timeout: 10000 });
```

#### Issue: Flaky Tests

**Solution**:
- Use proper waits (not `waitForTimeout`)
- Check for race conditions
- Ensure proper test isolation
- Use `toBeVisible()` instead of `isVisible()`

#### Issue: Browser Not Found

**Solution**:
```bash
# Reinstall browsers
npx playwright install chromium
```

---

## Additional Resources

### Documentation
- [Playwright Documentation](https://playwright.dev)
- [Test Plan](./TEST_PLAN.md) - Comprehensive test case documentation
- [Next.js Testing](https://nextjs.org/docs/testing)

### Test Case Reference
See [TEST_PLAN.md](./TEST_PLAN.md) for:
- Complete list of test cases
- Test case details (steps, expected results)
- Mobile-first strategy
- Coverage matrix

### Support
- GitHub Issues: Report test failures or bugs
- Team Chat: Ask questions in #testing channel
- Code Reviews: Request test reviews for new features

---

## Quick Reference

### Most Used Commands

```bash
# Development
npm run test:ui              # Interactive test runner
npx playwright test -g "TC-VA-001"  # Run specific test

# Mobile Testing
npm run test:mobile          # Mobile devices only

# Debugging
npx playwright test --headed # See browser
npx playwright test --debug  # Step-by-step debugger

# Reports
npm run test:report          # View test results
```

### Key Directories

```
VidScoreAI/
├── e2e/                     # Test files
│   ├── video-analyzer.spec.ts
│   ├── editor.spec.ts
│   └── navigation.spec.ts
├── playwright.config.ts     # Playwright configuration
├── TEST_PLAN.md            # Comprehensive test documentation
└── TESTING.md              # This file
```

---

**Last Updated**: 2025-11-18  
**Playwright Version**: 1.56.1  
**Node.js Version**: 20+
