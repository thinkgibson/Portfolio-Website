import { test, expect } from '@playwright/test';

const STORAGE_KEY = 'portfolio:tapePositions:v1';

test('mouse drag moves a tape and persists position', async ({ page }) => {
  await page.goto('http://localhost:3000/video');
  // Wait for client render of tapes
  const tape = page.locator('.tape-item').first();
  await expect(tape).toBeVisible({ timeout: 5000 });

  const box = await tape.boundingBox();
  expect(box).not.toBeNull();
  if (!box) return;

  const startX = box.x + box.width / 2;
  const startY = box.y + box.height / 2;

  // perform a mouse drag
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + 120, startY + 60, { steps: 12 });
  await page.mouse.up();

  // allow the client to save to localStorage
  await page.waitForTimeout(250);

  const raw = await page.evaluate((k) => localStorage.getItem(k), STORAGE_KEY);
  expect(raw).not.toBeNull();
  const parsed = JSON.parse(raw as string) as Array<{ id: number; x: number; y: number }>;
  expect(Array.isArray(parsed)).toBeTruthy();
  expect(parsed.length).toBeGreaterThan(0);

  // at least one tape should have moved significantly in X
  const xs = parsed.map((p) => p.x);
  const maxX = Math.max(...xs);
  expect(maxX).toBeGreaterThan(30);
});
