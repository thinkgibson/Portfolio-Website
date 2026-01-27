# Git Issue #51: Fix Window Focus Not Working

## Goal Description
The goal is to fix window focus behavior in the Windows 95 desktop environment. Currently, window activation toggles an `isActive` flag which switches between `z-50` and `z-10`. This approach fails to maintain a proper "stacking history" for inactive windows (e.g., the previously active window should remain above other inactive windows).
I will verify the issue by creating a new E2E test, and then fix it by implementing a proper window stacking mechanism where the active window is moved to the top of the stack (end of the DOM list).

## User Review Required
None. This is a standard bug fix.

## Proposed Changes

### Component Logic

#### [MODIFY] [OSDesktop.tsx](file:///i:/code/VSCode/PortfolioWebsite/components/win95/OSDesktop.tsx)
-   Update `handleSetActive` to:
    1.  Find the window with the target `id`.
    2.  Remove it from the `openWindows` array.
    3.  Push it to the **end** of the array (rendering it last/on top).
    4.  Set its `isActive` to true, and all others to false.
-   Update `handleOpenWindow` to ensure new windows are also appended to the end (already does this, but ensure consistent behavior).

#### [MODIFY] [Win95Window.tsx](file:///i:/code/VSCode/PortfolioWebsite/components/win95/Win95Window.tsx)
-   (Optional) Clean up usage of `z-50`/`z-10`.
-   **Decision**: I will KEEP `z-50` for the active window as a safeguard, but standardizing on DOM order is the primary fix. The `z-10` for all others is fine if they are sorted by recency.

## Verification Plan

### Automated Tests
-   **New E2E Test**: `e2e/tests/window-focus.spec.ts`
    -   **Scenario**:
        1.  Open "About" (`desktop-icon-about_me.doc`).
        2.  Open "Contact" (`desktop-icon-contact_information.txt`).
        3.  Verify "Contact" is on top (active).
        4.  Click "About" window body.
        5.  Verify "About" comes to front (active) and "Contact" is behind.
        6.  Verify z-indices or element order.
    -   **Command**: `npm run test:e2e -- e2e/tests/window-focus.spec.ts`

### Manual Verification
1.  Open Project A.
2.  Open Project B.
3.  Drag Project B so it partially overlaps Project A.
4.  Click Project A.
5.  Verify Project A renders **on top** of Project B.
