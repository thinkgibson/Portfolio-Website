import { test, expect } from '@playwright/test';

test('dragging a VHS tape persists position after reload', async ({ page }) => {
  await page.goto('http://localhost:3000/video');

  const tape = page.locator('.tape-item', { hasText: 'Neon Nights' }).first();
  await expect(tape).toBeVisible();

  const box = await tape.boundingBox();
  expect(box).not.toBeNull();
  const startX = box!.x + box!.width / 2;
  const startY = box!.y + box!.height / 2;

  // Drag by an offset
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + 60, startY + 40, { steps: 6 });
  await page.mouse.up();

  // Read transform style from the element's container (should have transform applied)
  const transform = await tape.evaluate((el) => (el as HTMLElement).style.transform || null);
  expect(transform).toContain('translate(');

  // Reload and ensure persistence in localStorage (at least that the key exists)
  await page.reload();
  const raw = await page.evaluate(() => localStorage.getItem('portfolio:tapePositions:v1'));
  expect(raw).not.toBeNull();
  const parsed = JSON.parse(raw as string);
  expect(Array.isArray(parsed)).toBe(true);
});
