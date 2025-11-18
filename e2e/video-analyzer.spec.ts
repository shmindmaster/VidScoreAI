import { test, expect, devices } from '@playwright/test';

/**
 * Video Analyzer Flow E2E Tests
 * Tests the main video upload, analysis, and reporting functionality
 * Mobile-first approach with cross-device validation
 */

test.describe('Video Analyzer - Hero Section', () => {
  test('TC-VA-001: Hero section displays correctly and CTA button works', async ({ page, isMobile }) => {
    await page.goto('/');

    // Verify hero section is visible
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();

    // Verify headline text
    await expect(page.getByRole('heading', { name: /Stop Guessing.*Start Converting/i })).toBeVisible();

    // Verify sub-headline is readable
    await expect(page.getByText(/VidScore AI analyzes your video ads/i)).toBeVisible();

    // Verify CTA button
    const ctaButton = page.getByRole('button', { name: /Analyze Your Video Now/i });
    await expect(ctaButton).toBeVisible();

    // Mobile-specific checks: verify touch-friendly size
    if (isMobile) {
      const buttonBox = await ctaButton.boundingBox();
      expect(buttonBox).not.toBeNull();
      if (buttonBox) {
        // Minimum touch target size: 44x44px
        expect(buttonBox.height).toBeGreaterThanOrEqual(44);
        expect(buttonBox.width).toBeGreaterThanOrEqual(44);
      }
    }

    // Test scroll functionality
    await ctaButton.click();
    
    // Wait for uploader section to be in viewport after scroll
    const uploaderSection = page.locator('#uploader-section');
    await expect(uploaderSection).toBeInViewport();
  });

  test('TC-VA-001: Verify scroll indicator animation', async ({ page }) => {
    await page.goto('/');

    // Verify scroll indicator (arrow) is visible
    const scrollIndicator = page.locator('.animate-bounce').first();
    await expect(scrollIndicator).toBeVisible();
  });
});

test.describe('Video Analyzer - Features Section', () => {
  test('TC-VA-002: Features section displays correctly across viewports', async ({ page, viewport }) => {
    await page.goto('/');

    // Scroll to features section
    await page.evaluate(() => {
      window.scrollTo(0, window.innerHeight);
    });

    // Verify features heading
    await expect(page.getByRole('heading', { name: /AI-Powered Video Intelligence/i })).toBeVisible();

    // Verify all 3 feature cards
    await expect(page.getByText('Performance Scoring')).toBeVisible();
    await expect(page.getByText('Actionable Insights')).toBeVisible();
    await expect(page.getByText('Instant Analysis')).toBeVisible();

    // Verify descriptions are present
    await expect(page.getByText(/Get comprehensive scores for hook strength/i)).toBeVisible();
    await expect(page.getByText(/Receive specific, data-driven recommendations/i)).toBeVisible();
    await expect(page.getByText(/Upload your video and get detailed feedback/i)).toBeVisible();

    // Check responsive layout
    if (viewport) {
      const featureCards = page.locator('.grid > div').filter({ hasText: 'Performance Scoring' }).first();
      await expect(featureCards).toBeVisible();
    }
  });
});

test.describe('Video Analyzer - File Upload', () => {
  test('TC-VA-004: Upload video file using file picker', async ({ page }) => {
    await page.goto('/');

    // Scroll to uploader
    await page.locator('#uploader-section').scrollIntoViewIfNeeded();

    // Verify uploader heading
    await expect(page.getByText('Upload Your Video to Get Your Free Performance Score')).toBeVisible();

    // Verify file input accepts correct types
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toHaveAttribute('accept', '.mp4,.mov');

    // Create a test file
    const buffer = Buffer.from('fake video content');
    await fileInput.setInputFiles({
      name: 'test-video.mp4',
      mimeType: 'video/mp4',
      buffer: buffer,
    });

    // Verify loading analysis screen appears
    await expect(page.getByText('Analyzing your video...')).toBeVisible({ timeout: 2000 });
  });

  test('TC-VA-003: Drag and drop visual feedback (desktop)', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Drag and drop not applicable on mobile');

    await page.goto('/');
    await page.locator('#uploader-section').scrollIntoViewIfNeeded();

    const dropZone = page.locator('div[onDragOver]').first();
    await expect(dropZone).toBeVisible();

    // Verify initial border color
    await expect(dropZone).toHaveClass(/border-gray-600/);
  });

  test('TC-VA-005: Invalid file upload handling', async ({ page }) => {
    await page.goto('/');
    await page.locator('#uploader-section').scrollIntoViewIfNeeded();

    const fileInput = page.locator('input[type="file"]');

    // Try to upload invalid file type
    const buffer = Buffer.from('fake pdf content');
    await fileInput.setInputFiles({
      name: 'document.pdf',
      mimeType: 'application/pdf',
      buffer: buffer,
    });

    // File should be rejected (component filters by type)
    // The uploader should remain visible (not transition to loading)
    await expect(page.getByText('Upload Your Video to Get Your Free Performance Score')).toBeVisible();

    // Loading screen should NOT appear
    await expect(page.getByText('Analyzing your video...')).not.toBeVisible();
  });

  test('TC-VA-006: Large file size handling', async ({ page }) => {
    await page.goto('/');
    await page.locator('#uploader-section').scrollIntoViewIfNeeded();

    // Verify size limit text is displayed
    await expect(page.getByText('Maximum file size: 100MB')).toBeVisible();
  });
});

test.describe('Video Analyzer - Loading & Analysis', () => {
  test('TC-VA-007: Loading animation and progress indicators', async ({ page }) => {
    await page.goto('/');
    await page.locator('#uploader-section').scrollIntoViewIfNeeded();

    // Upload a file
    const fileInput = page.locator('input[type="file"]');
    const buffer = Buffer.from('fake video content');
    await fileInput.setInputFiles({
      name: 'test-video.mp4',
      mimeType: 'video/mp4',
      buffer: buffer,
    });

    // Verify loading screen appears
    await expect(page.getByText('Analyzing your video...')).toBeVisible({ timeout: 2000 });

    // Verify descriptive text
    await expect(page.getByText(/This may take a moment/i)).toBeVisible();

    // Verify spinner is present
    const spinner = page.locator('.animate-spin').first();
    await expect(spinner).toBeVisible();

    // Verify progress steps are visible
    await expect(page.getByText(/Analyzing video content and visual elements/i)).toBeVisible();
    await expect(page.getByText(/Evaluating pacing and timing patterns/i)).toBeVisible();
    await expect(page.getByText(/Checking hook strength and engagement factors/i)).toBeVisible();
    await expect(page.getByText(/Reviewing overlays and call-to-action elements/i)).toBeVisible();

    // Wait for analysis to complete (5 second timeout in component)
    await expect(page.getByText('VidScore AI: Performance Report')).toBeVisible({ timeout: 7000 });
  });
});

test.describe('Video Analyzer - Performance Report', () => {
  // Helper function to complete upload and reach report
  async function navigateToReport(page: any) {
    await page.goto('/');
    await page.locator('#uploader-section').scrollIntoViewIfNeeded();
    
    const fileInput = page.locator('input[type="file"]');
    const buffer = Buffer.from('fake video content');
    await fileInput.setInputFiles({
      name: 'test-video.mp4',
      mimeType: 'video/mp4',
      buffer: buffer,
    });
    
    // Wait for report to appear
    await expect(page.getByText('VidScore AI: Performance Report')).toBeVisible({ timeout: 7000 });
  }

  test('TC-VA-008: Performance report overall score section', async ({ page }) => {
    await navigateToReport(page);

    // Verify report header
    await expect(page.getByRole('heading', { name: 'VidScore AI: Performance Report' })).toBeVisible();

    // Verify overall score section
    await expect(page.getByText('Overall Score')).toBeVisible();
    
    // Verify score is displayed (82/100 in mock data)
    await expect(page.getByText('82/100')).toBeVisible();

    // Verify descriptive text
    await expect(page.getByText('Excellent performance!')).toBeVisible();
  });

  test('TC-VA-009: Detailed score breakdown sections', async ({ page }) => {
    await navigateToReport(page);

    // Verify all 4 score sections
    const sections = [
      { title: 'Hook Strength', score: '95/100' },
      { title: 'Pacing & Flow', score: '75/100' },
      { title: 'Call-to-Action (CTA)', score: '60/100' },
      { title: 'Visual & Text Overlays', score: '88/100' },
    ];

    for (const section of sections) {
      await expect(page.getByText(section.title)).toBeVisible();
      await expect(page.getByText(section.score)).toBeVisible();
    }

    // Verify suggestions are present
    await expect(page.getByText(/Excellent opening/i)).toBeVisible();
    await expect(page.getByText(/Pacing is strong but dips/i)).toBeVisible();
    await expect(page.getByText(/The CTA is present but could be stronger/i)).toBeVisible();
    await expect(page.getByText(/Great use of text overlays/i)).toBeVisible();
  });

  test('TC-VA-010: PDF download button functionality', async ({ page }) => {
    await navigateToReport(page);

    // Verify download button is visible
    const downloadButton = page.getByRole('button', { name: /Download Report \(PDF\)/i });
    await expect(downloadButton).toBeVisible();
    await expect(downloadButton).toBeEnabled();

    // Click download button
    await downloadButton.click();

    // Verify button shows loading state
    await expect(page.getByText('Generating...')).toBeVisible({ timeout: 1000 });
  });

  test('TC-VA-011: Video thumbnail display in report', async ({ page }) => {
    await navigateToReport(page);

    // Verify "Analyzed Video" section
    await expect(page.getByText('Analyzed Video')).toBeVisible();

    // Verify filename is displayed
    await expect(page.getByText('test-video.mp4')).toBeVisible();

    // Verify video thumbnail placeholder with play icon
    const videoSection = page.locator('.aspect-video').first();
    await expect(videoSection).toBeVisible();
  });
});

test.describe('Video Analyzer - Mobile Usability', () => {
  test('TC-RES-001: Mobile viewport - home page layout @mobile', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile-only test');
    
    await page.goto('/');

    // Verify no horizontal scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // Allow 1px tolerance

    // Verify text is readable (check font size)
    const headline = page.getByRole('heading', { name: /Stop Guessing/i });
    const fontSize = await headline.evaluate(el => {
      return window.getComputedStyle(el).fontSize;
    });
    const fontSizeNum = parseInt(fontSize);
    expect(fontSizeNum).toBeGreaterThanOrEqual(16);

    // Verify navigation is accessible
    await expect(page.getByRole('navigation')).toBeVisible();

    // Verify upload section fits viewport
    await page.locator('#uploader-section').scrollIntoViewIfNeeded();
    const uploaderSection = page.locator('#uploader-section');
    await expect(uploaderSection).toBeInViewport();
  });

  test('TC-RES-006: Touch target sizing on mobile', async ({ page }) => {
    await page.goto('/');

    // Test CTA button size
    const ctaButton = page.getByRole('button', { name: /Analyze Your Video Now/i });
    const buttonBox = await ctaButton.boundingBox();
    expect(buttonBox).not.toBeNull();
    if (buttonBox) {
      expect(buttonBox.height).toBeGreaterThanOrEqual(44);
      expect(buttonBox.width).toBeGreaterThanOrEqual(44);
    }

    // Test navigation links
    const navLinks = page.getByRole('link', { name: /Video Analyzer|AI Editor/i });
    const linkCount = await navLinks.count();
    
    for (let i = 0; i < linkCount; i++) {
      const link = navLinks.nth(i);
      const linkBox = await link.boundingBox();
      expect(linkBox).not.toBeNull();
      if (linkBox) {
        expect(linkBox.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('TC-RES-007: Smooth scrolling on mobile', async ({ page }) => {
    await page.goto('/');

    // Test scroll to uploader
    const ctaButton = page.getByRole('button', { name: /Analyze Your Video Now/i });
    await ctaButton.click();
    
    await page.waitForTimeout(1000); // Wait for scroll animation

    // Verify uploader is in view
    const uploaderSection = page.locator('#uploader-section');
    await expect(uploaderSection).toBeInViewport();

    // Verify fixed navigation is stable
    await expect(page.getByRole('navigation')).toBeVisible();
  });
});

test.describe('Video Analyzer - Accessibility', () => {
  test('TC-ACC-001: Keyboard navigation', async ({ page }) => {
    await page.goto('/');

    // Navigate with Tab key
    await page.keyboard.press('Tab');
    
    // Check if focus is visible (should be on logo or first nav item)
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();

    // Continue tabbing to CTA button
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
    }

    // Activate button with Enter
    await page.keyboard.press('Enter');
    
    // Verify scroll happened
    const uploaderSection = page.locator('#uploader-section');
    await expect(uploaderSection).toBeInViewport();
  });
});
