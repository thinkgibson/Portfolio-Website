# Add:
- [x] **Start menu:**  
    Clicking the start button should open a windows 95 style start menu. It should contain links to open the same shortcuts that are on the desktop.
- [] **Apps:**  
    Add basic functioning apps like notepad, paint, and calculator. Focus on minimum viable product - they function and can be used but do not need to be polished or have features like saving.
- [] **Games:**  
    Add basic functioning games like pong, space invaders, solitaire, and tetris. Focus on minimum viable product - they function and can be played but do not need to be polished or have features like saving, multiple difficulty levels, etc.
- [x] **Window resize:**  
    Add the ability to resize windows. The window should be able to be resized by dragging the bottom-right corner.
- [] **Taskbar icons:**  
    Add icons to the bottom right taskbar next to the clock. It should include a weather icon, a volume icon, and a network speed icon (ie wifi bars).
- [] **Right click menu:**  
    Add a right click menu that appears when right clicking on the desktop. It should include options to change the wallpaper, close all windows, and minimize all windows.
- [] **Animated wallpapers:**  
    Add the ability to change the wallpaper. The wallpapers should be animated and should be able to be changed from the right click menu. Style must match the Windows 95 style.
- [] **Functioning toolbar buttons:**  
    In each window make the buttons actually work with a dropdown menu of actions:
    - File: Maximize, Minimize, Close
    - Search: Opens searchbox for body text in that window
    - Help: Opens help window with information about that window, its purpose, and how to use it
- [] **Terminal app:**  
    Add a terminal app that can be opened from the start menu. It should have a command prompt that can be used to open other apps and games. It should also have a help command that can be used to open an ascii version of the help window for that app.
- [] **Right-click app in bottom taskbar:**  
    When a window is right-clicked in the bottom taskbar it should open a right-click menu that includes options to open the app, close the app, and minimize the app.

# Change:
- [x] **Fonts:**  
    Replace the current font with a more appropriate font for the Windows 95 style. Try to match the correct font as closely as possible including using different fonts in the correct places (ie header vs body text vs UI label etc).
- [x] **Desktop icons:**  
    Replace the current icons with more appropriate icons for the Windows 95 style. Make sure to update desktop icons, app icons, and window header icons. Also the start menu icon. Try to match the correct icons as closely as possible.
- [x] **Playwright ci-flow:**  
    Add playwright test results to ci-flow terminal output so that pass/fail is shown as they run. IE (Test that window controls are functional - PASSED)

# Fix: 
After fixing make sure to write unit and playwright tests to cover this issue and make sure they pass.
- [x] **Window header buttons**  
    The buttons on the top-right of each window are missing the correct icons (minimize, expand, and close). Find the correct win95 icons and add them to the window header. Also make sure the buttons are interactive and function as expected.
- [x] **Window location persistance**  
    When a window is minimized, its position should be saved so that it can be restored to the same position when it is maximized again. Closing the window and reopening it should restore it to the last known position.
- [x] **Mobile support**  
    - [x] Add support for mobile devices. Windows should not expand beyond the screen. All other functionality should be accessible through touch. Make sure to expand mobile test cases to cover this functionality.
    - [x] On mobile devices, windows should default to 90% of screen width and height and be centered on the screen. They should not be resizable. All other functionality should be accessible through touch.
- [x] **Window focus**  
    Last opened or clicked window is now in focus. When a window is focused, it should be raised to the top of the z-order. When a window is unfocused, it should be lowered to the bottom of the z-order.
- [x] **Toolbar searchbox**  
    The searchbox should be able to search through the body text of the window and highlight the search results.
- [x] **Help**  
    The help menu should only contain "about". The "about" option should open a help window with information about that window, its purpose, and how to use it.
- [x] **Window header buttons**  
    The icons in the top right of the window are not spaced equally from each other
- [x] **Window drag post-maximize bug**  
    When a window is repositioned, maximized, click maximized again, and then repositioned it incorrectly snaps near the top-right of the desktop. It should reposition as normal without any snapping.
- [x] **Window collision**  
    - Windows should not be able to overlap the bottom taskbar. If a window is dragged to the bottom of the screen it should be stopped at the taskbar. If a window is dragged to the top of the screen it should be stopped at the top of the screen. If a window is dragged to the left or right of the screen it should be stopped at the edge of the screen.
- [] **Desktop border**  
    - Windows should not be able to be dragged off the screen. If the user drags a window off the screen, it should snap back to the edge of the screen.
- [] **Unit test error**  
    Fix the error that appears in the terminal when running the unit tests as part of the ci-flow. The error is: Error: Not implemented: window.scrollTo...