# Git Issue #18: Add a Basic Terminal App

## Execution Order & Dependencies

> [!WARNING]
> **Batch 3** — Execute AFTER #16, #17, #19 are merged

| Relationship | Details |
|--------------|---------|
| **Depends On** | None (but should wait for #19 to avoid conflicts) |
| **Conflicts With** | #20 (both modify `StartMenu.tsx`, `icons.tsx`, `HomeClient.tsx`) |
| **Must Complete Before** | #20 (Music Player) — OR run #20 first |

---

## Overview

Add a terminal/command-line application that can be opened from the Start Menu or a desktop icon. The terminal provides a basic command system for interacting with the OS.

### Features

1. **Terminal Window**
   - Windows 95-style command prompt UI
   - Text input with command history
   - Scrollable output area
   - Blinking cursor aesthetic

2. **Command System**
   - `open <app>` - Open other applications
   - `list` - View list of running apps
   - `close <app>` - Close any running app
   - `restart` - Restart the system (reload webpage)
   - `help` - List all available commands

3. **Integration Points**
   - Accessible from Start Menu (Programs submenu)
   - Optional desktop icon
   - Uses existing `Win95Window` component

---

## Expected Code Changes

### New Files

| File | Purpose |
|------|---------|
| `components/win95/Terminal.tsx` | Main terminal component |
| `__tests__/components/win95/Terminal.test.tsx` | Unit tests for Terminal |
| `e2e/tests/terminal-app.spec.ts` | E2E tests for terminal functionality |

### Modified Files

| File | Changes |
|------|---------|
| `components/win95/OSDesktop.tsx` | Add terminal window handling, expose app control methods to terminal |
| `components/win95/StartMenu.tsx` | Add "Terminal" or "Command Prompt" entry to Programs submenu |
| `components/win95/icons.tsx` | Add `TerminalIcon` (DOS prompt icon) |
| `components/HomeClient.tsx` | Add terminal to windows array |

---

## Architecture Notes

### Terminal Component Structure

```
Terminal.tsx
├── CommandInput          // Text input with submit handler
├── OutputHistory         // Scrollable div showing command history
├── CommandProcessor      // Parse and execute commands
└── PromptLine           // "C:\>" style prompt display
```

### Command Processing

```tsx
interface CommandResult {
    output: string;
    success: boolean;
}

const commands: Record<string, (args: string[]) => CommandResult> = {
    help: () => ({ output: "Available commands: open, list, close, restart, help", success: true }),
    open: (args) => { /* open app by name */ },
    list: () => { /* list running windows */ },
    close: (args) => { /* close app by name or ID */ },
    restart: () => { window.location.reload(); return { output: "Restarting...", success: true }; }
};
```

### Context Requirements

The Terminal needs access to:
- List of open windows (from OSDesktop state)
- Functions to open/close windows
- Consider using React Context or prop drilling

### Window Integration

- Add `iconType: "terminal"` to window types
- Default window size: ~500x300px
- Black background with green/white text (classic DOS look)

---

## Git Branch/Commit/Merge Instructions

> [!NOTE]
> Follow the [git-pr-merge skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/git-pr-merge/SKILL.md) for the complete workflow.

1. **Create Branch**
   ```bash
   git checkout -b gitissue-18
   ```

2. **Commit Message Format**
   ```bash
   git commit -m "feat: add terminal app (closes #18)"
   ```

3. **Push & Create PR**
   ```bash
   gh pr create --fill --push
   ```

4. **Merge** (after approval)
   ```bash
   gh pr merge --merge --delete-branch
   ```

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| **Access to window state** | Terminal needs read/write access to window list; use context or callbacks |
| **App name resolution** | Commands like `open notepad` need to map to window IDs; create name→ID lookup |
| **Icon type additions** | Extend `iconType` union type across components |
| **Command injection** | Sanitize command input; only allow predefined commands |
| **Start Menu conflicts** | Coordinate with any pending Start Menu changes |
| **Self-referential commands** | Handle `close terminal` gracefully |
| **Window focus on input** | Keep focus in terminal input field |

---

## Test Coverage

> [!NOTE]
> Follow the [designing-tests skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/designing-tests/SKILL.md) for testing best practices.

### Unit Tests (`__tests__/components/win95/Terminal.test.tsx`)

- [ ] Renders terminal with input field
- [ ] `help` command lists all available commands
- [ ] `list` command shows running windows
- [ ] `open <app>` triggers open callback
- [ ] `close <app>` triggers close callback
- [ ] Unknown command shows error message
- [ ] Command history is displayed in output area
- [ ] Empty command is ignored
- [ ] Arrow keys navigate command history (optional)

### Integration Tests

- [ ] Terminal can open other applications
- [ ] Terminal can close other applications
- [ ] `list` shows accurate window list
- [ ] `restart` triggers page reload (mocked)

### E2E Tests (`e2e/tests/terminal-app.spec.ts`)

- [ ] Open terminal from Start Menu
- [ ] Type `help` and see command list
- [ ] Type `list` and see running apps
- [ ] Type `open notepad` and notepad opens
- [ ] Type `close notepad` and notepad closes
- [ ] Title bar shows "Command Prompt" or "Terminal"
- [ ] Window can be minimized/restored from taskbar

### Test Commands

```bash
# Run unit tests
npm run test -- Terminal

# Run all unit tests
npm run test

# Run E2E tests
npm run test:e2e -- terminal-app.spec.ts

# Run full CI flow
npm run ci-flow
```

---

## Implementation Checklist

- [ ] Create `Terminal.tsx` component
- [ ] Add `TerminalIcon` to `icons.tsx`
- [ ] Add terminal window type to `OSDesktop.tsx`
- [ ] Add "Terminal" to Start Menu
- [ ] Implement command parser
- [ ] Implement all 5 commands (help, open, list, close, restart)
- [ ] Style with classic DOS aesthetics
- [ ] Write unit tests
- [ ] Write E2E tests
- [ ] Verify all tests pass with `npm run ci-flow`

---

## UI Mockup Reference

```
┌─────────────────────────────────────────────┐
│ ◼ Command Prompt                   [_][□][X]│
├─────────────────────────────────────────────┤
│ ████████████████████████████████████████████│
│ █ Portfolio OS [Version 1.0]               █│
│ █ (c) 2024. All rights reserved.           █│
│ █                                          █│
│ █ C:\> help                                █│
│ █ Available commands:                      █│
│ █   open <app>  - Open an application      █│
│ █   list        - Show running apps        █│
│ █   close <app> - Close an application     █│
│ █   restart     - Restart the system       █│
│ █   help        - Show this help           █│
│ █                                          █│
│ █ C:\> _                                   █│
│ ████████████████████████████████████████████│
└─────────────────────────────────────────────┘
```

Black background with white or green text. Monospace font (like `Consolas` or `Courier New`).
