import { test, expect } from '@playwright/test';

test('tape follows mouse while button is held (visual)', async ({ page }) => {
  await page.goto('http://localhost:3000/video');
  const tape = page.locator('.tape-item').first();
  await expect(tape).toBeVisible({ timeout: 5000 });

  const before = await tape.boundingBox();
  expect(before).not.toBeNull();
  if (!before) return;

  const startX = before.x + before.width / 2;
  const startY = before.y + before.height / 2;

  // press and move: during the move, the element's bounding box should update
  await page.mouse.move(startX, startY);
  await page.mouse.down();

  const targetX = startX + 120;
  const targetY = startY + 60;
  await page.mouse.move(targetX, targetY, { steps: 12 });
  // give the renderer a short moment to apply the transform, then sample
  await page.waitForTimeout(120);
  const during = await tape.boundingBox();
  expect(during).not.toBeNull();
  if (!during) {
    await page.mouse.up();
    return;
  }

  // The tape should have moved horizontally by a noticeable amount
  // (relaxed threshold to allow small rendering delays in CI/dev)
  expect(Math.abs(during.x - before.x)).toBeGreaterThan(3);

  // release the mouse and confirm it stays at final position
  await page.mouse.up();
  await page.waitForTimeout(200);

  const after = await tape.boundingBox();
  expect(after).not.toBeNull();
  if (!after) return;
  expect(Math.abs(after.x - during.x)).toBeLessThan(10);
});
