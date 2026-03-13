# Issue 147: Desktop right-click menu issues on mobile/tablet

On mobile and tablet devices, the desktop right-click menu (context menu) does not function correctly. This plan addresses triggering via long-press, correct positioning at the touch point, and ensuring the menu stays within viewport bounds.

## User Review Required

> [!IMPORTANT]
> This change introduces custom long-press handling which might conflict with browser-default long-press actions (like "Open in new tab" on links). We will aim to only trigger it on areas that don't have their own specific long-press behavior, or handle it gracefully.

## Proposed Changes

### Context Menu Component

Improved positioning logic to handle different orientations and viewport edges more reliably.

#### [MODIFY] [ContextMenu.tsx](file:///i:/code/VSCode/PortfolioWebsite/components/win95/ContextMenu.tsx)

- Update `useIsomorphicLayoutEffect` to also capture `menuWidth`.
- Use `menuWidth` and `menuHeight` for more accurate positioning in `adjustedX` and `adjustedY`.
- Ensure the menu doesn't overflow the viewport by forcing it to stay within `[8, window.innerWidth - 8]` and `[8, window.innerHeight - 8]`.
- Specific fix: If `anchorY === 'bottom'`, ensure it doesn't overlap the taskbar (though the caller should handle this, the component should be safe).

### OS Desktop Component

Added refined mobile triggering logic and improved event handling.

#### [MODIFY] [OSDesktop.tsx](file:///i:/code/VSCode/PortfolioWebsite/components/win95/OSDesktop.tsx)

- Implement `useLongPress` hook or inline logic using `onPointerDown`, `onPointerUp`, and `onPointerMove`.
- The long-press should trigger `handleContextMenu` after ~500ms of holding without significant movement.
- Update `onClick` on desktop container:
  - Close menus if open.
  - On mobile, if no menu/start-menu is open, a simple tap should *not* trigger the context menu (to avoid frustration), but long-press will.
- Update `handleContextMenu` to support `React.MouseEvent` or `PointerEvent` coordinates.

### Taskbar Component

Added long-press detection for taskbar items and the taskbar itself.

#### [MODIFY] [Taskbar.tsx](file:///i:/code/VSCode/PortfolioWebsite/components/win95/Taskbar.tsx)

- Apply similar long-press logic to taskbar items and the taskbar background.
- This ensures users on mobile can access window controls (Minimize/Close) via the taskbar.

#### [NEW] [useLongPress.ts](file:///i:/code/VSCode/PortfolioWebsite/lib/hooks/useLongPress.ts)

- Create a reusable hook for long-press detection.
- Parameters: `callback`, `options` (delay, threshold).
- Returns: Object with pointer event handlers.

## Verification Plan

### Automated Tests

- **New E2E Test**: `e2e/tests/mobile-context-menu.spec.ts`
  - Simulate long-press on desktop using Playwright's `dispatch` or `pointer` events.
  - Verify menu visibility and position.
  - Verify menu stays within viewport when triggered near edges.

### Manual Verification

1. Open the site on a mobile device (or use browser DevTools mobile emulation).
2. Long-press on the desktop background.
   - **Verify**: Context menu appears at the touch location.
3. Long-press near the bottom-right corner.
   - **Verify**: Context menu appears but stays fully visible (doesn't go off-screen).
4. Long-press on a taskbar item.
   - **Verify**: Window-specific context menu appears.
5. Tap away from the menu.
   - **Verify**: Menu closes.
