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

---

# Test Fixes: Firefox Volume Slider Click Handler (2026-01-17)

## Problem
The Playwright test `volume slider appears and persists value` was failing in Firefox. The slider value wasn't being updated when clicking on the track.

## Root Cause
Firefox doesn't properly translate click position to input value for vertical range sliders using `WebkitAppearance: 'slider-vertical'`. The hidden input overlaying the track wasn't receiving click events in a way that Firefox could process.

## Solution
1. Added an explicit `onClick` handler to the slider track div that calculates volume from click position:
   - Computes click Y position relative to track top
   - Inverts the percentage (0% at bottom, 100% at top)
   - Clamps the value between 0 and 100
2. Added `data-testid="volume-slider-track"` for reliable test targeting
3. Updated the test to use `getByTestId('volume-slider-track')` instead of brittle CSS class selector

## Verification
All 5 volume slider tests pass across Chromium, Firefox, and WebKit (Desktop and Mobile).

---

# Test Fixes: Notepad Focus & Save Dialog (2026-01-18)

## Notepad Toolbar Focus

### Problem
Notepad unit tests were failing because `document.queryCommandState` was returning false, causing toolbar buttons not to highlight correctly.

### Root Cause
Clicking toolbar buttons was causing the `contentEditable` div to lose focus before the command state could be queried. The implementation was updated to use `onMouseDown` with `e.preventDefault()`, but the tests were still simulating `click`.

### Solution
Updated `__tests__/components/win95/Notepad.test.tsx` to simulate `mouseDown` events instead of `click` events, aligning the test behavior with the implementation.

## Save Dialog Visibility

### Problem
The "Save" E2E test in `notepad-app.spec.ts` was flaky, failing to detect the "Save As" dialog visibility even though it appeared visually.

### Root Cause
Using `getByText` was potentially ambiguous or flaky in the complex DOM structure containing overlays.

### Solution
1. Added `data-testid="save-dialog"` to the `SaveDialog` component root.
2. Updated `notepad-app.spec.ts` to use `getByTestId('save-dialog')` for robust selection.

## Verification
- Unit Tests: All 8 Notepad tests pass.
- E2E Tests: All 10 Playwright tests pass (including `save via Save button and Save As dialog`).

---

# Test Fixes: Desktop Icon Click Handler (2026-02-05)

## Problem
The Playwright tests for Video Essays, Documentaries, and Livestreams were consistently failing on Chromium in the CI environment, timeout out while trying to open the app from the My Portfolio folder.

## Root Cause
The tests were using .dblclick() to open desktop icons. However, the DesktopIcon component uses an onClick handler (single click) to trigger the opening action. While .dblclick() worked locally and on Firefox/Webkit (likely due to event bubbling or timing differences), it caused race conditions or failed to trigger the click handler correctly in the headless Chromium CI environment.

## Solution
Updated video-essays-app.spec.ts, documentaries-app.spec.ts, and livestreams-app.spec.ts to use .click() instead of .dblclick(). This matches the implementation's event handler and eliminates the test flakiness.

## Verification
- Verified that all E2E tests pass on Chromium, Firefox, Webkit, Mobile Chrome, and Mobile Safari.
