// ABOUTME: Exercises reader journeys and regressions that source checks cannot catch.
// ABOUTME: Tests search, themes, responsive reading, chapter jumps, and isolated signup responses.
import { test, expect } from '@playwright/test';

const benchmark = '/blog/benchmarking-agents-on-real-engineering-work/';

test('search finds an article and follows a deployed result URL', async ({ page }) => {
  await page.goto('/search/');
  await page.getByRole('textbox', { name: /search/i }).fill('HVAC');
  const result = page.locator('.pagefind-ui__result-link').first();
  await expect(result).toBeVisible();
  await expect(result).toHaveAttribute('href', /\/blog\//);
  await result.click();
  await expect(page.locator('.post-content')).toBeVisible();
});

for (const theme of ['light', 'dark'] as const) {
  test(`fresh ${theme} preference toggles on the first click and persists`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme });
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    await page.locator('#theme-toggle').click();
    const next = theme === 'light' ? 'dark' : 'light';
    await expect(page.locator('html')).toHaveAttribute('data-theme', next);
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', next);
  });
}

test('theme still works when browser storage is blocked', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error('Storage unavailable'); };
    Storage.prototype.setItem = () => { throw new Error('Storage unavailable'); };
  });
  await page.goto('/');
  await page.locator('#theme-toggle').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('mobile readers reach the latest essay and article content quickly', async ({ page }, info) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const latest = await page.locator('.latest').boundingBox();
  expect(latest!.y).toBeLessThan(650);
  await expect(page.locator('.site-brand span')).toBeVisible();
  await page.screenshot({ path: info.outputPath('home-mobile.png'), fullPage: true });
  await page.goto(benchmark);
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('.chapter-strip')).not.toHaveAttribute('open', '');
  const prose = await page.locator('.post-content').boundingBox();
  expect(prose!.y).toBeLessThan(1050);
  await page.screenshot({ path: info.outputPath('article-mobile.png') });
});

test('mobile menu supports keyboard dismissal', async ({ page }) => {
  await page.goto('/');
  await page.locator('.mobile-menu summary').click();
  await expect(page.locator('.mobile-links').getByRole('link', { name: 'Search' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.mobile-links')).not.toBeVisible();
  await expect(page.locator('.mobile-menu summary')).toBeFocused();
});

test('chapter rail survives jumps and clears headings without moving prose', async ({ page }) => {
  await page.goto(benchmark);
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  const top = await page.locator('.post-content').evaluate(e => e.getBoundingClientRect().top + scrollY);
  await page.evaluate(() => scrollTo(0, 4000));
  await expect(page.locator('.chapter-rail')).toHaveClass(/is-visible/);
  await expect(page.locator('.chapter-rail')).not.toHaveAttribute('inert', '');
  await page.locator('.chapter-rail a').nth(1).click();
  const geometry = await page.evaluate(() => ({
    target: document.querySelector(location.hash)!.getBoundingClientRect().top,
    bottom: document.querySelector('.chapter-rail')!.getBoundingClientRect().bottom,
    top: document.querySelector('.post-content')!.getBoundingClientRect().top + scrollY,
  }));
  expect(geometry.target).toBeGreaterThanOrEqual(geometry.bottom);
  expect(Math.abs(geometry.top - top)).toBeLessThan(1);
});

test('light theme colours meet text contrast and navigation uses the secondary token', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  const values = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    return Object.fromEntries(['--color-bg', '--color-text-secondary', '--color-text-tertiary', '--color-accent', '--color-button-bg', '--color-button-text'].map(key => [key, style.getPropertyValue(key).trim()]));
  });
  const luminance = (hex: string) => {
    const rgb = hex.slice(1).match(/../g)!.map(part => parseInt(part, 16) / 255).map(c => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4);
    return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
  };
  const contrast = (a: string, b: string) => (Math.max(luminance(a), luminance(b)) + .05) / (Math.min(luminance(a), luminance(b)) + .05);
  for (const token of ['--color-text-secondary', '--color-text-tertiary', '--color-accent']) expect(contrast(values[token], values['--color-bg'])).toBeGreaterThanOrEqual(4.5);
  expect(contrast(values['--color-button-text'], values['--color-button-bg'])).toBeGreaterThanOrEqual(4.5);
  await page.locator('.mobile-menu summary').click();
  await expect(page.locator('.mobile-links a').first()).toHaveCSS('color', 'rgb(107, 107, 118)');
});

for (const width of [320, 768, 1440]) {
  test(`pages stay inside a ${width}px viewport`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ['/', '/subscribe/', '/tags/agent-evaluation/', benchmark]) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), path).toBeLessThanOrEqual(1);
    }
    if (width === 1440) await page.screenshot({ path: info.outputPath('article-desktop.png') });
  });
}

test('newsletter failure is actionable and a retry can succeed', async ({ page }) => {
  let requests = 0;
  await page.route('**/api/subscribe', route => {
    requests++;
    return route.fulfill({ status: requests === 1 ? 503 : 200, contentType: 'application/json', body: JSON.stringify(requests === 1 ? { error: 'Please try again in a moment.' } : { message: 'You are subscribed.' }) });
  });
  await page.goto('/subscribe/');
  await page.getByRole('textbox', { name: 'Email address' }).fill('reader@example.com');
  await page.getByRole('button', { name: 'Subscribe', exact: true }).click();
  await expect(page.locator('[data-subscribe-status]')).toContainText('Please try again');
  await expect(page.getByRole('button', { name: 'Subscribe', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: 'Subscribe', exact: true }).click();
  await expect(page.locator('[data-subscribe-status]')).toHaveText('You are subscribed.');
  expect(requests).toBe(2);
});

test('rendered MDX charts retain keyboard interaction within the desktop gutter', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(benchmark);
  const chart = page.locator('[data-gb-root]').first();
  const legend = chart.locator('[data-gb-legend]').first();
  const label = await legend.getAttribute('data-series-label');
  await legend.focus();
  await expect(chart).toHaveClass(/is-active/);
  await expect(chart.locator('[data-gb-kicker]')).toHaveText(label!);
  await expect(chart.locator('.gb-panel')).toHaveCSS('opacity', '1');
  const panel = await chart.locator('.gb-panel').boundingBox();
  expect(panel!.x + panel!.width).toBeLessThanOrEqual(1440);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});
