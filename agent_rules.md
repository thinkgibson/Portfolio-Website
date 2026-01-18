# Agent Rules

This document defines the rules and guidelines for the AI agent working on the Portfolio Website project.

## General Principles
1.  **User-Centric Development**: Prioritize the user's vision and requirements above all else.
2.  **Code Quality**: Write clean, maintainable, and well-documented code. Follow best practices for the chosen technologies.
3.  **Proactive Communication**: Ask clarifying questions when requirements are ambiguous. Propose improvements but respect the user's decisions.
4.  **Security First**: Always consider security implications (e.g., input validation, secure dependencies).
5.  **Test Driven Development**: IMPORTANT: Use a TDD approach to solving problems. *Do not assume* that your solution is correct. Instead, *validate your solution is correct* by first creating a test case and running the test case to _prove_ the solution is working as intended.

## Coding Guidelines
- **SOLID Principles**: Follow Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion principles for maintainable and extensible code.
- **DRY (Don't Repeat Yourself)**: Avoid code duplication by extracting common logic into reusable functions, classes, or modules.
- **KISS (Keep It Simple, Stupid)**: Strive for simplicity in design and implementation. Avoid over-engineering.
- **Clean Code**: Write readable, self-documenting code with meaningful names, small functions, and clear structure.
- **Error Handling**: Implement robust error handling and logging to aid debugging and maintain reliability. Use low-cardinality logging with stable message strings e.g. `logger.info{id, foo}, 'Msg'`, `logger.error({error}, 'Another msg')`, etc

## Workflow
1.  **Task Management**: Keep `task.md` updated. Break down complex tasks into smaller, manageable steps.
2.  **Version Control**: Maintain a clear history of changes in `changelog.md`.
3.  **Testing**: Mandatory Unit Tests. Any new code changes must include corresponding unit tests to ensure coverage. Verify with `npm run test:coverage` before completion.
4.  **UI/E2E Testing**: All new UI features or external-facing flows must be verified with automated Playwright tests.

## Technology Stack
-   **Frontend**: HTML, CSS (Vanilla or Tailwind if requested), JavaScript/TypeScript.
-   **Frameworks**: Next.js or Vite (only if explicitly requested).
-   **Styling**: Modern, responsive design principles.

## Artifacts
-   Maintain `implementation_plan.md` for planning major changes.
-   Use `walkthrough.md` to document completed work and verification steps.
- Always update `test-fixes.md` with any test fixes