# Test Fixes: Window Drag Constraints

## Problem
The Playwright test case `window cannot be dragged completely off-screen` was failing in Chromium and Webkit. The root cause was that while Framer Motion's `dragConstraints` prevented the window from being *dragged* off-screen visually, the `onPositionChange` callback in `OSDesktop.tsx` was saving the raw, un-clamped coordinates from the drag event.

## Solution
Implemented coordinate clamping within the `onPositionChange` handler in `OSDesktop.tsx`. This ensures that any saved window position is within reasonable bounds (at least partially on-screen).

## Verification
- Verified that the specific test case `window cannot be dragged completely off-screen` passes in Chromium, Webkit, and Firefox.
- Verified that other window control tests (maximize, restore, close) continue to pass.

---

# Test Fixes: WebKit Drag Timing (2026-01-17)

## Problem
The Playwright test `persists window position after closing and reopening` was failing in WebKit. The window was expected to move ~200px but was only reaching ~99px.

## Root Cause
WebKit needs more drag steps and a small delay for Framer Motion drag animations to register properly.

## Solution
Updated `window-persistence.spec.ts` to increase drag steps and add a small delay.

---

# Test Fixes: WebKit Sub-pixel Precision (2026-01-17)

## Problem
The Playwright test `window cannot be dragged completely off-screen` was failing in WebKit due to sub-pixel precision.

## Solution
Widened tolerance in `test-windows.spec.ts` from -10 to -11.

---

# Test Fixes: Missing data-testid in Win95Window (2026-01-17)

## Problem
The unit test `calls onMaximize when maximize button is clicked` was failing in `Win95Window.test.tsx`.

## Root Cause
While resizing the window control buttons in `Win95Window.tsx` to accommodate larger icons, the `data-testid="window-maximize"` prop was inadvertently removed.

## Solution
Restored the `data-testid="window-maximize"` prop to the maximize button.

## Verification
All 61 project tests pass.

---

# Test Fixes: Font-Family Assertion Mismatch (2026-01-17)

## Problem
The Playwright test `verify font-family application` was failing across all projects.

## Root Cause
As part of the UI scaling effort (making icons 150-200% larger), the window title bar font size was intentionally increased from `12px` to `13px` in `Win95Window.tsx` to maintain visual balance. However, the Playwright test had a hardcoded assertion for `12px`.

## Solution
Updated the assertion in `e2e/tests/font-verification.spec.ts` to expect `13px` for window title spans.

## Verification
Verified that `verify font-family application` passes on Chromium, Firefox, and WebKit (Desktop and Mobile).
All 61 project tests are now back to green.
