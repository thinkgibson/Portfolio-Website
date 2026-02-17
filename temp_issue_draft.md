**Title**: [Bug]: Desktop icon text labels do not wrap properly and overflow boundaries
**Labels**: bug

**Body**:
### distinct failure
The text underneath desktop icons is not wrapping as expected. For labels with multiple words or long names (e.g., "contact information .Txt"), the text can extend beyond the icon container width and potentially go off-screen or overlap with adjacent icons.

### Steps to Reproduce
1. Open the Portfolio Website.
2. Observe icons with long labels, specifically "contact information .Txt".
3. Note how the text overflows the expected icon boundary.

### Expected Behavior
The text label should wrap to multiple lines within the width constraint of the `DesktopIcon` component. It should not exceed the container's horizontal boundaries or impede on the space of neighboring icons.

### Environment
- OS: Windows (User report)
