import { test, expect, devices } from '@playwright/test';

/**
 * Navigation and Layout E2E Tests
 * Tests for fixed navigation, page routing, and layout consistency
 */

test.describe('Navigation - Fixed Navigation Bar', () => {
  test('TC-NAV-001: Fixed navigation display and scroll behavior', async ({ page }) => {
    await page.goto('/');

    // Verify navigation bar visible
    const nav = page.getByRole('navigation');
    await expect(nav).toBeVisible();

    // Verify logo and brand name
    await expect(page.getByRole('link', { name: /VidScore AI/i })).toBeVisible();

    // Verify navigation links
    await expect(page.getByRole('link', { name: 'Video Analyzer' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'AI Editor' })).toBeVisible();

    // Get initial navigation position
    const navBox1 = await nav.boundingBox();
    expect(navBox1).not.toBeNull();

    // Scroll down page
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500);

    // Verify navigation remains fixed at top
    const navBox2 = await nav.boundingBox();
    expect(navBox2).not.toBeNull();
    
    if (navBox1 && navBox2) {
      // Y position should remain the same (fixed)
      expect(navBox2.y).toBe(navBox1.y);
    }

    // Verify navigation is still visible after scroll
    await expect(nav).toBeVisible();
  });

  test('TC-NAV-001: Navigation backdrop blur effect', async ({ page }) => {
    await page.goto('/');

    const nav = page.getByRole('navigation');
    
    // Check for backdrop blur classes
    const navClasses = await nav.getAttribute('class');
    expect(navClasses).toContain('backdrop-blur');
  });
});

test.describe('Navigation - Page Routing', () => {
  test('TC-NAV-002: Navigate to Video Analyzer from editor', async ({ page }) => {
    await page.goto('/editor');

    // Verify we're on editor page
    expect(page.url()).toContain('/editor');

    // Click Video Analyzer link
    await page.getByRole('link', { name: 'Video Analyzer' }).click();

    // Verify navigation to home page
    await expect(page).toHaveURL('/');

    // Verify Video Analyzer link is highlighted (active state)
    const analyzerLink = page.getByRole('link', { name: 'Video Analyzer' });
    const linkClasses = await analyzerLink.getAttribute('class');
    expect(linkClasses).toContain('text-blue-400');

    // Verify home page content loads
    await expect(page.getByRole('heading', { name: /Stop Guessing.*Start Converting/i })).toBeVisible();
  });

  test('TC-NAV-003: Navigate to AI Editor from home', async ({ page }) => {
    await page.goto('/');

    // Verify we're on home page
    expect(page.url()).not.toContain('/editor');

    // Click AI Editor link
    await page.getByRole('link', { name: 'AI Editor' }).click();

    // Verify navigation to editor page
    await expect(page).toHaveURL('/editor');

    // Verify AI Editor link is highlighted
    const editorLink = page.getByRole('link', { name: 'AI Editor' });
    const linkClasses = await editorLink.getAttribute('class');
    expect(linkClasses).toContain('text-blue-400');

    // Verify editor page content loads
    await expect(page.getByRole('heading', { name: /The Next-Gen.*Video Creation Engine/i })).toBeVisible();
  });

  test('TC-NAV-004: Navigate to home via logo click', async ({ page }) => {
    // Test from editor page
    await page.goto('/editor');

    // Click logo
    const logoLink = page.getByRole('link', { name: /VidScore AI/i }).first();
    await logoLink.click();

    // Verify navigation to home
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: /Stop Guessing/i })).toBeVisible();

    // Test logo click from home page (should stay on home)
    await logoLink.click();
    await expect(page).toHaveURL('/');
  });

  test('TC-NAV-004: Logo link behavior consistency', async ({ page }) => {
    await page.goto('/');

    // Verify logo is a link
    const logoLink = page.getByRole('link', { name: /VidScore AI/i }).first();
    await expect(logoLink).toHaveAttribute('href', '/');
  });
});

test.describe('Navigation - Mobile Navigation', () => {
  test('TC-NAV-001: Mobile navigation layout @mobile', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile-only test');
    
    await page.goto('/');

    const nav = page.getByRole('navigation');
    await expect(nav).toBeVisible();

    // Verify navigation doesn't take excessive height
    const navBox = await nav.boundingBox();
    expect(navBox).not.toBeNull();
    if (navBox) {
      // Navigation should be reasonable height on mobile (typically ~64px)
      expect(navBox.height).toBeLessThanOrEqual(80);
    }

    // Verify logo is readable
    await expect(page.getByRole('link', { name: /VidScore AI/i })).toBeVisible();

    // Verify navigation links are accessible
    await expect(page.getByRole('link', { name: 'Video Analyzer' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'AI Editor' })).toBeVisible();
  });

  test('TC-NAV-001: Mobile navigation touch targets @mobile', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile-only test');
    
    await page.goto('/');

    // Test logo touch target
    const logo = page.getByRole('link', { name: /VidScore AI/i }).first();
    const logoBox = await logo.boundingBox();
    expect(logoBox).not.toBeNull();
    if (logoBox) {
      expect(logoBox.height).toBeGreaterThanOrEqual(44);
    }

    // Test navigation link touch targets
    const analyzerLink = page.getByRole('link', { name: 'Video Analyzer' });
    const linkBox = await analyzerLink.boundingBox();
    expect(linkBox).not.toBeNull();
    if (linkBox) {
      expect(linkBox.height).toBeGreaterThanOrEqual(44);
    }
  });
});

test.describe('Navigation - Active States', () => {
  test('Active state updates correctly on navigation', async ({ page }) => {
    // Start on home page
    await page.goto('/');

    // Video Analyzer should be active
    let analyzerLink = page.getByRole('link', { name: 'Video Analyzer' });
    let analyzerClasses = await analyzerLink.getAttribute('class');
    expect(analyzerClasses).toContain('text-blue-400');

    // AI Editor should not be active
    let editorLink = page.getByRole('link', { name: 'AI Editor' });
    let editorClasses = await editorLink.getAttribute('class');
    expect(editorClasses).not.toContain('text-blue-400');

    // Navigate to editor
    await editorLink.click();
    await expect(page).toHaveURL('/editor');

    // Now AI Editor should be active
    editorLink = page.getByRole('link', { name: 'AI Editor' });
    editorClasses = await editorLink.getAttribute('class');
    expect(editorClasses).toContain('text-blue-400');

    // Video Analyzer should not be active
    analyzerLink = page.getByRole('link', { name: 'Video Analyzer' });
    analyzerClasses = await analyzerLink.getAttribute('class');
    expect(analyzerClasses).not.toContain('text-blue-400');
  });
});

test.describe('Layout - Responsive Breakpoints', () => {
  test('TC-RES-003: Small mobile viewport (iPhone SE)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Verify no horizontal scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);

    // Verify content is readable
    const headline = page.getByRole('heading', { name: /Stop Guessing/i });
    await expect(headline).toBeVisible();

    // Verify navigation works
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  test('TC-RES-003: Tablet viewport (iPad)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    // Verify layout uses available space
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();

    // Check feature cards layout (should be multi-column)
    await page.evaluate(() => window.scrollTo(0, window.innerHeight));
    const featureCards = page.locator('.grid').filter({ hasText: 'Performance Scoring' });
    await expect(featureCards.first()).toBeVisible();
  });

  test('TC-RES-004: Large desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    // Verify content doesn't stretch too wide
    const mainContent = page.locator('section').first();
    await expect(mainContent).toBeVisible();

    // Check that content has reasonable max-width
    const heroText = page.locator('.max-w-5xl').first();
    await expect(heroText).toBeVisible();
  });
});

test.describe('Layout - Page Structure', () => {
  test('Verify consistent layout structure across pages', async ({ page }) => {
    // Home page structure
    await page.goto('/');
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();

    // Editor page structure
    await page.goto('/editor');
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
  });

  test('Verify body and main styling consistency', async ({ page }) => {
    await page.goto('/');

    // Check body background
    const body = page.locator('body');
    const bodyClasses = await body.getAttribute('class');
    expect(bodyClasses).toContain('bg-gray-950');

    // Check main has proper top padding for fixed nav
    const main = page.locator('main');
    const mainClasses = await main.getAttribute('class');
    expect(mainClasses).toContain('pt-16'); // Top padding for fixed nav
  });
});

test.describe('Layout - Scroll Behavior', () => {
  test('TC-RES-007: Smooth scroll animation', async ({ page }) => {
    await page.goto('/');

    // Click CTA to trigger smooth scroll
    const ctaButton = page.getByRole('button', { name: /Analyze Your Video Now/i });
    await ctaButton.click();

    // Wait for scroll animation
    await page.waitForTimeout(1000);

    // Verify target section is in view
    const uploaderSection = page.locator('#uploader-section');
    await expect(uploaderSection).toBeInViewport();

    // Verify navigation remains fixed and visible
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  test('Verify scroll position after navigation', async ({ page }) => {
    await page.goto('/');

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(300);

    // Navigate to editor
    await page.getByRole('link', { name: 'AI Editor' }).click();
    await expect(page).toHaveURL('/editor');

    // Verify page scrolled to top on navigation
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThanOrEqual(10);
  });
});

test.describe('Layout - Content Overflow', () => {
  test('No horizontal scroll on any page - mobile @mobile', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile-only test');

    const pages = ['/', '/editor'];

    for (const pagePath of pages) {
      await page.goto(pagePath);

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // Allow 1px tolerance
    }
  });

  test('No horizontal scroll on any page - desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });

    const pages = ['/', '/editor'];

    for (const pagePath of pages) {
      await page.goto(pagePath);

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
    }
  });
});

test.describe('Layout - Z-Index and Layering', () => {
  test('Navigation stays on top of content', async ({ page }) => {
    await page.goto('/');

    // Scroll to uploader section
    await page.locator('#uploader-section').scrollIntoViewIfNeeded();

    // Verify navigation is still visible and on top
    const nav = page.getByRole('navigation');
    await expect(nav).toBeVisible();

    // Check z-index
    const zIndex = await nav.evaluate(el => {
      return window.getComputedStyle(el).zIndex;
    });
    expect(parseInt(zIndex)).toBeGreaterThan(0);
  });
});
