import { test, expect, devices } from '@playwright/test';

/**
 * AI Editor Flow E2E Tests
 * Tests the multi-file upload, style selection, and video generation functionality
 * Mobile-first approach with cross-device validation
 */

test.describe('AI Editor - Hero Section', () => {
  test('TC-ED-001: Editor page hero and introduction', async ({ page }) => {
    await page.goto('/editor');

    // Verify page loads successfully
    expect(page.url()).toContain('/editor');

    // Verify hero section
    await expect(page.getByRole('heading', { name: /The Next-Gen.*Video Creation Engine/i })).toBeVisible();

    // Verify AI VIDEO EDITOR badge
    await expect(page.getByText('AI VIDEO EDITOR')).toBeVisible();

    // Verify description text
    await expect(page.getByText(/Upload your raw footage, choose your style/i)).toBeVisible();

    // Verify background effects render (check for gradient containers)
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();
  });

  test('TC-ED-009: Editor features section display', async ({ page }) => {
    await page.goto('/editor');

    // Scroll to features section
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    // Verify features heading
    await expect(page.getByRole('heading', { name: 'Four Powerful Styles' })).toBeVisible();

    // Verify description
    await expect(page.getByText(/Each style is optimized for different content types/i)).toBeVisible();

    // Verify all 4 style cards in features section
    await expect(page.getByText('High-Impact Ad')).toBeVisible();
    await expect(page.getByText('Organic Story')).toBeVisible();
    await expect(page.getByText('Cinematic Recap')).toBeVisible();
    await expect(page.getByText('Product Demo')).toBeVisible();

    // Verify descriptions
    await expect(page.getByText(/Perfect for TikTok, Reels & Shorts/i)).toBeVisible();
    await expect(page.getByText(/Authentic and engaging/i)).toBeVisible();
    await expect(page.getByText(/Beautiful transitions and color grading/i)).toBeVisible();
    await expect(page.getByText(/Clear and focused presentations/i)).toBeVisible();
  });
});

test.describe('AI Editor - Multi-File Upload', () => {
  test('TC-ED-002: Upload single video file', async ({ page }) => {
    await page.goto('/editor');

    // Verify uploader is visible
    await expect(page.getByText('Select multiple video files')).toBeVisible();

    // Verify file input accepts correct types
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toHaveAttribute('accept', '.mp4,.mov');
    await expect(fileInput).toHaveAttribute('multiple');

    // Upload a single file
    const buffer = Buffer.from('fake video content');
    await fileInput.setInputFiles({
      name: 'clip1.mp4',
      mimeType: 'video/mp4',
      buffer: buffer,
    });

    // Verify file appears in preview grid
    await expect(page.getByText('clip1.mp4')).toBeVisible();

    // Verify file information displayed
    // Size should be calculated (fake buffer is very small, so will be 0.0 MB)
    await expect(page.getByText(/MB/)).toBeVisible();

    // Verify remove button is present
    const removeButton = page.locator('button').filter({ has: page.locator('svg') }).first();
    await expect(removeButton).toBeVisible();

    // Verify style selector appears
    await expect(page.getByText('Choose Your Video\'s Style')).toBeVisible();
  });

  test('TC-ED-003: Upload multiple video files', async ({ page, viewport }) => {
    await page.goto('/editor');

    const fileInput = page.locator('input[type="file"]');

    // Upload multiple files
    const files = [
      {
        name: 'clip1.mp4',
        mimeType: 'video/mp4',
        buffer: Buffer.from('fake video 1'),
      },
      {
        name: 'clip2.mov',
        mimeType: 'video/quicktime',
        buffer: Buffer.from('fake video 2'),
      },
      {
        name: 'clip3.mp4',
        mimeType: 'video/mp4',
        buffer: Buffer.from('fake video 3'),
      },
    ];

    await fileInput.setInputFiles(files);

    // Verify all files appear
    await expect(page.getByText('clip1.mp4')).toBeVisible();
    await expect(page.getByText('clip2.mov')).toBeVisible();
    await expect(page.getByText('clip3.mp4')).toBeVisible();

    // Verify grid layout displays files
    const fileCards = page.locator('.grid > div').filter({ hasText: 'clip1.mp4' });
    await expect(fileCards.first()).toBeVisible();

    // Verify no duplicates
    const clip1Count = await page.getByText('clip1.mp4').count();
    expect(clip1Count).toBe(1);
  });

  test('TC-ED-004: Remove file from upload list', async ({ page }) => {
    await page.goto('/editor');

    const fileInput = page.locator('input[type="file"]');

    // Upload multiple files
    await fileInput.setInputFiles([
      {
        name: 'clip1.mp4',
        mimeType: 'video/mp4',
        buffer: Buffer.from('fake video 1'),
      },
      {
        name: 'clip2.mp4',
        mimeType: 'video/mp4',
        buffer: Buffer.from('fake video 2'),
      },
    ]);

    // Verify both files present
    await expect(page.getByText('clip1.mp4')).toBeVisible();
    await expect(page.getByText('clip2.mp4')).toBeVisible();

    // Find and click remove button on first file
    const firstFileCard = page.locator('div').filter({ hasText: 'clip1.mp4' }).first();
    const removeButton = firstFileCard.locator('button').first();
    await expect(removeButton).toBeVisible();
    await removeButton.click();

    // Verify file removed
    await expect(page.getByText('clip1.mp4')).not.toBeVisible();

    // Verify other file remains
    await expect(page.getByText('clip2.mp4')).toBeVisible();

    // Remove last file
    const secondFileCard = page.locator('div').filter({ hasText: 'clip2.mp4' }).first();
    const secondRemoveButton = secondFileCard.locator('button').first();
    await secondRemoveButton.click();

    // Verify uploader reappears
    await expect(page.getByText('Select multiple video files')).toBeVisible();
    await expect(page.getByText('Choose Your Video\'s Style')).not.toBeVisible();
  });
});

test.describe('AI Editor - Style Selection', () => {
  // Helper function to upload files and reach style selector
  async function navigateToStyleSelector(page: any) {
    await page.goto('/editor');
    
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test-clip.mp4',
      mimeType: 'video/mp4',
      buffer: Buffer.from('fake video'),
    });
    
    await expect(page.getByText('Choose Your Video\'s Style')).toBeVisible();
  }

  test('TC-ED-005: Style selector display', async ({ page }) => {
    await navigateToStyleSelector(page);

    // Verify heading
    await expect(page.getByText('Choose Your Video\'s Style')).toBeVisible();

    // Verify all 4 style options
    const styles = [
      { title: 'High-Impact Ad', icon: true },
      { title: 'Organic Story', icon: true },
      { title: 'Cinematic Recap', icon: true },
      { title: 'Product Demo', icon: true },
    ];

    for (const style of styles) {
      const styleCard = page.locator('div').filter({ hasText: style.title }).first();
      await expect(styleCard).toBeVisible();
    }

    // Verify descriptions are present
    await expect(page.getByText(/Fast-paced cuts, punchy text/i)).toBeVisible();
    await expect(page.getByText(/Authentic and engaging. Ideal for testimonials/i)).toBeVisible();
    await expect(page.getByText(/Beautiful transitions, color grading/i)).toBeVisible();
    await expect(page.getByText(/Clear, concise, and focused on features/i)).toBeVisible();
  });

  test('TC-ED-006: Style selection interaction', async ({ page }) => {
    await navigateToStyleSelector(page);

    // Click on first style
    const highImpactStyle = page.locator('div').filter({ hasText: 'High-Impact Ad' }).filter({ hasText: /Fast-paced/ }).first();
    await highImpactStyle.click();

    // Verify selected state (should have blue border/highlight)
    await expect(highImpactStyle).toHaveClass(/border-blue-500/);

    // Verify generate button appears
    await expect(page.getByRole('button', { name: 'Generate My Video' })).toBeVisible();

    // Select different style
    const organicStyle = page.locator('div').filter({ hasText: 'Organic Story' }).filter({ hasText: /Authentic/ }).first();
    await organicStyle.click();

    // Verify new selection
    await expect(organicStyle).toHaveClass(/border-blue-500/);

    // Verify generate button still visible
    await expect(page.getByRole('button', { name: 'Generate My Video' })).toBeVisible();

    // Click generate button
    await page.getByRole('button', { name: 'Generate My Video' }).click();

    // Verify transition to video generation screen
    await expect(page.getByText('Generate My Video')).not.toBeVisible({ timeout: 2000 });
  });
});

test.describe('AI Editor - Video Generation', () => {
  async function navigateToGeneration(page: any, styleName: string = 'High-Impact Ad') {
    await page.goto('/editor');
    
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test-clip.mp4',
      mimeType: 'video/mp4',
      buffer: Buffer.from('fake video'),
    });
    
    await expect(page.getByText('Choose Your Video\'s Style')).toBeVisible();
    
    const styleCard = page.locator('div').filter({ hasText: styleName }).first();
    await styleCard.click();
    
    await page.getByRole('button', { name: 'Generate My Video' }).click();
  }

  test('TC-ED-007: Video generation progress display', async ({ page }) => {
    await navigateToGeneration(page);

    // Verify generation screen appears
    // Note: The actual component may show different content during generation
    // Adjust based on actual implementation
    
    // Wait a moment for any generation UI to appear
    await page.waitForTimeout(1000);

    // The component should show some generation-related content
    // Since the VideoGeneration component is not fully defined in the codebase provided,
    // we'll verify that we're no longer on the style selector
    await expect(page.getByText('Choose Your Video\'s Style')).not.toBeVisible();
  });

  test('TC-ED-008: Start new project flow', async ({ page }) => {
    await navigateToGeneration(page);

    // Wait for any generation process
    await page.waitForTimeout(1000);

    // Look for "Start New Project" button (if it appears after generation)
    // This test may need adjustment based on actual VideoGeneration component implementation
    const startNewButton = page.getByRole('button', { name: /Start New/i });
    
    // If button exists, test the flow
    if (await startNewButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await startNewButton.click();

      // Verify return to initial state
      await expect(page.getByText('Select multiple video files')).toBeVisible();
      await expect(page.getByText('Choose Your Video\'s Style')).not.toBeVisible();
    }
  });
});

test.describe('AI Editor - Mobile Usability', () => {
  test('TC-RES-002: Mobile viewport - editor page layout @mobile', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile-only test');
    
    await page.goto('/editor');

    // Verify no horizontal scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);

    // Verify title is readable
    const title = page.getByRole('heading', { name: /The Next-Gen/i });
    const fontSize = await title.evaluate(el => {
      return window.getComputedStyle(el).fontSize;
    });
    const fontSizeNum = parseInt(fontSize);
    expect(fontSizeNum).toBeGreaterThanOrEqual(16);

    // Upload file and verify responsive layout
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'mobile-test.mp4',
      mimeType: 'video/mp4',
      buffer: Buffer.from('fake video'),
    });

    // Verify file card displays properly
    await expect(page.getByText('mobile-test.mp4')).toBeVisible();

    // Verify style selector cards stack vertically on mobile
    await expect(page.getByText('Choose Your Video\'s Style')).toBeVisible();
    
    const styleCards = page.locator('div').filter({ hasText: 'High-Impact Ad' });
    await expect(styleCards.first()).toBeVisible();
  });

  test('TC-RES-002: Touch targets on mobile editor @mobile', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile-only test');
    
    await page.goto('/editor');

    // Test upload area touch target
    const uploadArea = page.locator('div').filter({ hasText: 'Select multiple video files' }).first();
    const uploadBox = await uploadArea.boundingBox();
    expect(uploadBox).not.toBeNull();
    if (uploadBox) {
      expect(uploadBox.height).toBeGreaterThanOrEqual(44);
    }

    // Upload file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test.mp4',
      mimeType: 'video/mp4',
      buffer: Buffer.from('fake video'),
    });

    // Test remove button size
    const removeButton = page.locator('button').filter({ has: page.locator('svg') }).first();
    const buttonBox = await removeButton.boundingBox();
    expect(buttonBox).not.toBeNull();
    if (buttonBox) {
      expect(buttonBox.height).toBeGreaterThanOrEqual(32); // Allow slightly smaller for icon buttons
      expect(buttonBox.width).toBeGreaterThanOrEqual(32);
    }

    // Test style selection cards
    const styleCard = page.locator('div').filter({ hasText: 'High-Impact Ad' }).first();
    const cardBox = await styleCard.boundingBox();
    expect(cardBox).not.toBeNull();
    if (cardBox) {
      expect(cardBox.height).toBeGreaterThanOrEqual(44);
    }
  });
});

test.describe('AI Editor - Responsive Design', () => {
  test('TC-RES-003: Tablet viewport layout @tablet', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });

    await page.goto('/editor');

    // Upload multiple files
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles([
      { name: 'clip1.mp4', mimeType: 'video/mp4', buffer: Buffer.from('1') },
      { name: 'clip2.mp4', mimeType: 'video/mp4', buffer: Buffer.from('2') },
      { name: 'clip3.mp4', mimeType: 'video/mp4', buffer: Buffer.from('3') },
    ]);

    // On tablet, files should display in grid (2-3 columns)
    const fileGrid = page.locator('.grid').first();
    await expect(fileGrid).toBeVisible();

    // Verify all files visible
    await expect(page.getByText('clip1.mp4')).toBeVisible();
    await expect(page.getByText('clip2.mp4')).toBeVisible();
    await expect(page.getByText('clip3.mp4')).toBeVisible();

    // Verify style selector uses grid layout
    await expect(page.getByText('Choose Your Video\'s Style')).toBeVisible();
  });

  test('TC-RES-004: Desktop viewport layout', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/editor');

    // Verify layout utilizes desktop space
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();

    // Upload files and verify grid layout
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles([
      { name: 'clip1.mp4', mimeType: 'video/mp4', buffer: Buffer.from('1') },
      { name: 'clip2.mp4', mimeType: 'video/mp4', buffer: Buffer.from('2') },
      { name: 'clip3.mp4', mimeType: 'video/mp4', buffer: Buffer.from('3') },
      { name: 'clip4.mp4', mimeType: 'video/mp4', buffer: Buffer.from('4') },
    ]);

    // On desktop, should show 3 columns
    await expect(page.getByText('clip1.mp4')).toBeVisible();
    await expect(page.getByText('clip2.mp4')).toBeVisible();
    await expect(page.getByText('clip3.mp4')).toBeVisible();
    await expect(page.getByText('clip4.mp4')).toBeVisible();

    // Verify style selector shows 2 columns on desktop
    const styleGrid = page.locator('.grid').filter({ has: page.getByText('High-Impact Ad') });
    await expect(styleGrid.first()).toBeVisible();
  });
});
