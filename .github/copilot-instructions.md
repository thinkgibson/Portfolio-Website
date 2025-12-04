# .github/copilot-instructions.md

Purpose
---
Provide short, actionable guidance for automated coding agents (Copilot/GPT agents) working in this repository.

High-level context
---
- This repository currently contains a small rules document at `GITHUB_COPILOT_RULES.md` which outlines agent workflows and local toolkit references (`c:\Users\ian\.aitk\instructions\tools.instructions.md`). Use that file as the source of truth for agent-specific conventions.
- There is no complex build system or tests committed in the repo root; treat repo changes as isolated edits unless you discover additional subprojects.

What an agent should know first
---
- Start by opening `GITHUB_COPILOT_RULES.md` at the repository root — it documents how this project expects agent behavior (pre-patch preambles, `apply_patch` usage, `manage_todo_list` expectations).
- Consult the local toolkit file: `c:\Users\ian\.aitk\instructions\tools.instructions.md` for global tool behavior and available helper tools.

Agent workflow (concise) (STRONGLY ENFORCED)
---
- Use the `manage_todo_list` tool to plan multi-step work. Create a small list, mark one item `in-progress`, mark completed as you finish.
- Before any modifying tool call (e.g., `apply_patch`, `create_file`), post a one-sentence preamble describing the immediate action.
- Use `apply_patch` to edit files. Keep diffs minimal and localized; avoid reformatting unrelated code.
- After making changes, summarize files added/modified and propose the next step (run tests, commit, push).
  - After making changes, run both unit tests and the Playwright E2E suite locally before committing.
  - MUST: After any code change, run `npm test` and the Playwright E2E suite (`npm run test:e2e:dev`) locally and record the results in the todo list before creating a commit or PR.
  - MUST: After making changes, update the version log with a new version entry summarizing changes made.
  - AUTOMATION: Agents must append a new `Version Log` entry automatically for any code change that has been validated by a passing unit test run and passing Playwright E2E run. Do not wait for explicit user approval before writing this entry; include a concise summary, date, and files changed.

Project-specific patterns & examples
---
- Path style: use Windows absolute paths when referencing local toolkit files, e.g. `c:\Users\ian\.aitk\instructions\tools.instructions.md`.
- Shell examples: when giving terminal commands, use PowerShell and join commands with `;`. Example:

  `cd 'i:\code\VSCode\Portfolio Website'; git add .\file; git commit -m 'msg'; git push`

- File edits: prefer single-file patches. Example apply_patch intent:

  - Add `i:\code\VSCode\Portfolio Website\newfile.md` with a single patch operation.

Commit message format (recommended)
---
- Use Conventional Commits for predictable, machine-readable history.
  - Format: `<type>(<scope>): <short summary>`
  - Common types: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`, `perf`, `ci`, `build`, `release`.
  - Examples: `feat(nav): add keyboard accessible menu`, `fix(audio): prevent Howler autoplay on load`.
  - When needed, include a longer body and a footer for issue references or `BREAKING CHANGE` notes.


Integration points & external dependencies
---
- No project-internal CI or external services are detectable in the repository. If you need to update CI or external integration, ask the user for missing config files or credentials.

Editing safety & limits
---
- Do not invent tests, build scripts, or new top-level components without asking — prefer minimal, reviewable changes.
- Avoid adding or modifying files outside the user's requested scope unless explicitly approved.

When `.github/copilot-instructions.md` already exists
---
- Merge intelligently: preserve repository-specific examples and workflows from `GITHUB_COPILOT_RULES.md` and `tools.instructions.md`. Do not blindly overwrite.




## AGENT BEHAVIOR (STRONGLY ENFORCED)

### Always Ask Clarifying Questions Before Generating
Examples:
- “Should this be a client or server component?”  
- “Does this component need animations?”  
- “Should drag-and-drop support be included?”  
- “Should a sound be played here?”

### Always Produce a Plan Before Writing Code
Plan should include:
1. Files to be created/updated  
2. Component structure  
3. Motion variants  
4. DnD behavior  
5. Audio integration  
6. Accessibility considerations
7. Concerns about edge cases, integration issues, broken scenarios, risk areas, etc
8. Unit tests to be created/updated
9. E2E tests to be created/updated  

The user must approve before code is generated.

### Asset Awareness
- Verify or ask the user about asset paths before generating audio code.

### Refactoring Ability
- Identify repeated patterns in:
  - DnD logic  
  - animation variants  
  - audio hooks  
- Suggest abstractions like reusable hooks, components, or motion presets.

### Error Handling
- For audio: handle missing files gracefully.
- For DnD: handle invalid drops.
- For motion: provide fallbacks if variants missing.

### Process

- Every workspace should have a file called "Version Log". Each new build gets a version number and an entry in the Version Log explaining what has changed.
- Create unit and E2E tests and run them with each build. All tests must pass before declaring a successful build. Every new feature or change should get appropriate test coverage. Bug fixes should include a new test to ensure the bug has actually been fixed and does not re-break in future builds.
- For any design changes refer to the "Design Style Rules" section in this document

### Design Style Rules
- 90's utopian scholastic aesthetic
- Inspirations: Myst, Where in the World is Carmen San Diego, Richard Scarry, Encarta '95, Island of Dr. Brain
- Colors should lean towards bright, primary, and muted pastel
- Styling should be simplistic drop shadow, motion blur, collages, detailed full-color illustrations
- Any items or technology should be 90's retro (VCR, CRT TV, camcorder, cassette tapes, CDs, stereo system, etc)





## TECH STACK FOUNDATIONS (COMMUNITY ALIGNED)

### Next.js (from community rules)
- Use Next.js file structure conventions (`app/` preferred; `pages/` only if the project uses it).
- Prefer **React Server Components** as the default (app router).  
- Only use `"use client"` when required (hooks, event handlers, motion, DnD, audio).
- Use **TypeScript** wherever possible.
- Prefer **modularization over duplication**.  
- Use **descriptive file & component names** (PascalCase components).
- For performance:
  - Use **image optimization** (`next/image`).
  - Use **dynamic imports** for heavy components (Framer Motion, DnD, Howler).
  - Use caching & memoization (`useMemo`, `useCallback`, `React.memo`).

### Tailwind CSS (from community rules)
- Use Tailwind as the **primary styling method**.
- Favor **utility classes** directly in JSX.
- Follow mobile-first responsive patterns (`sm:`, `md:`, `lg:`).
- For repeated patterns, extract reusable utilities via `@apply` or components.
- Avoid large CSS blocks or inline styles unless motion requires it.

---

## ANIMATION RULES (EXTENDS COMMUNITY — NEW SECTION)

### Framer Motion
- Use **Framer Motion** for all complex animations (enter/exit, layout changes, gestures).
- Wrap animated elements in `motion.*` components.
- Always define **variants** with `initial`, `animate`, `exit`.
- Avoid inline animation objects—use named variant objects for clarity.
- Keep animations small and scoped; don't animate large DOM trees.
- Respect `prefers-reduced-motion` and disable non-essential animation.
- Use motion + DnD together carefully:  
  - Motion handles the *visual* feedback.  
  - DnD handles the *data* and state logic.

---

## DRAG & DROP RULES (EXTENDS COMMUNITY — NEW SECTION)

### React DnD
- Use **React DnD** for any drag-and-drop interactions.
- Separate *interaction logic* from *presentation*:
  - Use hooks (`useDrag`, `useDrop`) for logic.
  - Use Framer Motion for animated feedback (hover, drag start, drop).
- Define **types** for draggable items (e.g. `"ITEM"`).
- Use context or custom hooks (`useDragContext`) for shared drag state.
- Provide drag states:
  - `isDragging`
  - `isOver`
  - `canDrop`
- On invalid drop:
  - Animate back or reset gracefully.
- Ensure DnD elements are keyboard accessible.

---

## AUDIO RULES (EXTENDS COMMUNITY — NEW SECTION)

### Howler.js
- Centralize audio logic inside a **custom hook** (`useSound` or `useHowler`).
- Only create Howler instances **once** (useRef/useMemo).
- Support:
  - play / stop / pause
  - volume
  - mute toggle
  - fade in/out when needed
- Audio files must reside in `/public` or a specified asset directory.
- The AI must warn if a referenced audio file is missing.
- Provide UI components for:
  - mute
  - volume slider
- Never autoplay audio unexpectedly.

---

## ACCESSIBILITY (COMMUNITY ALIGNED + EXTENDED)

- All interactive components must be keyboard accessible.
- Add appropriate ARIA roles for drag/drop elements:
  - `role="button"`
  - `role="option"`
  - `aria-grabbed`
  - `aria-dropeffect`
- Provide alt text, semantic HTML, and accessible labels.
- Respect user motion preferences (`prefers-reduced-motion`).
- Provide audio controls for accessible sound usage.

---

## CODE STYLE & QUALITY (COMMUNITY ALIGNED)

- Follow ESLint + Prettier formatting.
- Prefer **early returns** in functions.
- Use consistent naming:  
  - Booleans start with `is`, `has`, `should`.
- All files/components must include a brief header doc or JSDoc for clarity.
- Avoid deeply nested components; break into smaller pieces.

---

## PERFORMANCE (COMMUNITY ALIGNED + EXTENDED)

- Prefer SSG or SSR based on use case.
- Use `next/dynamic` to load:
  - Framer Motion
  - React DnD
  - Howler.js
  only when needed.
- Avoid unnecessary re-renders:
  - Use stable callbacks
  - Use state co-location
- Optimize images using `next/image`.

---

## TESTING (EXTENDED)

- Test motion logic via motion variant expectations (not visuals).
- Mock Howler for audio tests.
- Test drag/drop flows using testing-library with DnD test utilities.
- Test accessibility (keyboard nav, ARIA roles).
- Test server logic with Next.js route mocks.

---

