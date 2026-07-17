import { test, expect } from '@playwright/test';
import { retryUntilTabSelected } from './helpers';

// ── Landmark Roles ──

test('page has banner, main, and contentinfo landmarks', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('banner')).toBeVisible();
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.getByRole('contentinfo')).toBeVisible();
});

// ── Heading Hierarchy ──

test('homepage has exactly one h1', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
});

test('blog index has exactly one h1', async ({ page }) => {
  await page.goto('/blogs/');
  await expect(page.locator('h1')).toHaveCount(1);
});

test('blog post has exactly one h1', async ({ page }) => {
  await page.goto('/blogs/');
  const href = await page.getByRole('main').locator('a[href^="/blogs/"]:not([href="/blogs/"])').first().getAttribute('href');
  await page.goto(href!);
  await expect(page.locator('h1')).toHaveCount(1);
});

// ── Images ──

test('all images have alt text', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('img:not([alt])')).toHaveCount(0);
});

// ── Keyboard Navigation ──

test('future panel tabs are keyboard navigable', async ({ page }) => {
  await page.goto('/');
  const firstTab = page.getByRole('tab').first();

  // The keydown handler is wired by an afterInteractive script, so both the
  // initial focus-click and the ArrowDown may land before it binds. Retry each
  // until the intended tab reports selected.
  await retryUntilTabSelected(page, () => firstTab.click(), 0);
  await retryUntilTabSelected(page, () => firstTab.press('ArrowDown'), 1);
});

test('future panel tabs activate on Enter and Space', async ({ page }) => {
  await page.goto('/');
  const tabs = page.getByRole('tab');

  // A <div role="tab"> does not synthesize a click on Enter/Space the way a
  // <button> would, so the keydown handler must activate the focused tab.
  // Locator.press() focuses the tab before pressing.
  await retryUntilTabSelected(page, () => tabs.nth(2).press('Enter'), 2);
  await retryUntilTabSelected(page, () => tabs.nth(1).press(' '), 1);
});

// ── External Links ──

test('external links in header/footer have rel="noopener"', async ({ page }) => {
  await page.goto('/');
  for (const region of ['header', 'footer']) {
    const links = page.locator(`${region} a[target="_blank"]`);
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
    for (const link of await links.all()) {
      const rel = await link.getAttribute('rel');
      expect(rel).toContain('noopener');
    }
  }
});

// ── ARIA Attributes ──

test('future panel uses proper ARIA roles', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[role="tablist"]')).toHaveCount(1);
  await expect(page.locator('[role="tabpanel"]')).toHaveCount(3);
  await expect(page.locator('[role="tab"][aria-selected="true"]')).toHaveCount(1);
  await expect(page.locator('.future-panel__code.is-active')).toHaveCount(1);
});

test('future panel has no nested interactive controls', async ({ page }) => {
  await page.goto('/');
  // A <button> may not contain interactive descendants (invalid HTML, ambiguous
  // for keyboard/screen-reader users). Each tab is a <div role="tab"> so the
  // "Learn more" anchor can live inside it legally.
  await expect(page.locator('button:has(a)')).toHaveCount(0);
});
