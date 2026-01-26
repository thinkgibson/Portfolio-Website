# Git Issue #47: Investigate User Caching and Implement Desired Changes

## Overview
This plan addresses the need for "user caching" by implementing client-side persistence for user-specific data—specifically Weather and Location information in the Taskbar. Currently, these fetch from external APIs on every page load, which risks hitting rate limits (especially for `ipapi.co`) and degrades the user experience (unnecessary loading states).

This plan proposes adding `localStorage` caching with Time-To-Live (TTL) expiration for these data points.

## User Review Required
> [!NOTE]
> I am interpreting "User Caching" as "Caching User-Specific Data" (Location/Weather) to avoid API spam, as Volume persistence is already implemented. If this is incorrect, please clarify.

> [!IMPORTANT]
> **GDPR Compliance**: The proposed `localStorage` implementation for Weather/Location falls under "functional storage" (enhancing UI, not tracking).
> - We will **NOT** store the user's IP address.
> - We will **ONLY** store the derived City and Temperature.
> - This minimizes data collection to non-identifiable information, which generally does not require explicit consent for a functional portfolio demo.
> - **Privacy Note**: We are using `ipapi.co` which processes the IP, but we are not retaining it.

## Proposed Changes

### Components
#### [MODIFY] [OSDesktop.tsx](file:///i:/code/VSCode/PortfolioWebsite/components/win95/OSDesktop.tsx)
- **Remove** `localStorage` persistence for `win95-window-positions`.
- Ensure window positions and sizes are only stored in React state (memory-only), so they reset on page reload/reboot.
- Remove `useEffect` hooks that read/write `win95-window-positions`.

#### [MODIFY] [Taskbar.tsx](file:///i:/code/VSCode/PortfolioWebsite/components/win95/Taskbar.tsx)
- Modify `fetchWeather` to check `localStorage` before making API calls.
- Implement a `CACHE_DURATION` constant (e.g., 1 hour for weather, 24 hours for location).
- **GDPR Requirement**: Ensure `localStorage` ONLY saves `{ city, temp, description, timestamp }`. Explicitly exclude `ip`, `latitude`, `longitude` from storage if possible (or just store City/Temp).
- Save successful API responses to `localStorage` with a timestamp.
- Clear/Fetch new data if the cache is expired or missing.

## Architecture Notes
- **Storage Keys**:
  - `win95-weather-cache`: Stores `{ data: WeatherData, timestamp: number }`
  - `win95-location-cache`: Stores `{ data: LocationData, timestamp: number }`
- **Cache Logic**:
  - Weather: 1 hour TTL.
  - Location: 24 hours TTL.
- **Privacy**: Location data is stored only locally on the client.

## Verification Plan

### Automated Tests
- **Unit Tests**:
  - I will create a new test file `__tests__/components/win95/Taskbar.caching.test.tsx` (or similar) to mock `localStorage` and `fetch`, ensuring:
    - Data is fetched from API when cache is empty.
    - Data is returned from cache when valid.
    - API is called when cache is expired.
    - `localStorage` is updated after fetch.

- **E2E Tests**:
  - Run existing `taskbar.spec.ts` (if compatible) to ensure no regression.
  - run `npm run test:e2e` to verify full suite.
  - **New Test Case**: Create `e2e/tests/window-persistence.spec.ts`:
    1.  Open a window (e.g., "About").
    2.  Move/Resize the window to a non-default position.
    3.  Reload the page.
    4.  Verify the window is closed (or if reopened, is back at default position).
    5.  Open the window again.
    6.  Verify it is at the *default* position/size, NOT the modified one.

### Manual Verification
1. Open the website.
2. Click the Weather icon (Data should be "Detecting..." then show weather).
3. Reload the page.
4. Click the Weather icon immediately (Data should show almost instantly, without "Detecting..." or with very brief loading if accessing storage).
5. Verify in DevTools -> Application -> Local Storage that `win95-weather-cache` exists.
