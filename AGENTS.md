# Repository Guidelines

## Project Structure & Module Organization
- `extension/` contains the browser extension source.
  - `extension/content/` injects UI overlays and blocking logic into job boards.
  - `extension/runtime/` hosts popup UI, background service worker, and shared modules.
  - `extension/assets/` stores extension images and icons.
- `images/` and `video/` store marketing assets for the README and releases.
- `other-manifests/` holds alternate manifests (for example `other-manifests/firefox/manifest.json`).

## Build, Test, and Development Commands
- No build step or package manager is used; the code is plain ES6 modules.
- Local testing (manual):
  - Chrome: open `chrome://extensions/`, enable Developer Mode, click “Load unpacked”, select `extension/`.
  - After edits: click the refresh icon on the extension card, then refresh the job board tab.
- Validate manifests by opening `extension/manifest.json` and `other-manifests/firefox/manifest.json` in the browser’s extension UI if needed.

## Coding Style & Naming Conventions
- JavaScript is vanilla ES6; keep modules small and readable.
- Match existing file and class naming patterns in `extension/content/` and `extension/runtime/`.
- Prefer descriptive identifiers for job board selectors and attributes (see `extension/runtime/modules/job-boards.js`).

## Testing Guidelines
- There are no automated tests in this repo.
- Manual testing is required on supported job boards (LinkedIn, Indeed, Glassdoor).
- Verify both popup UI behavior and in-page overlays for blocked listings.

## Commit & Pull Request Guidelines
- Recent commits use Conventional Commit-style prefixes like `feat:` and `style:`; follow that format when possible.
- PRs should include a clear description, manual test steps, and screenshots/GIFs for UI changes.
- Link relevant issues (if any), and note any job-board-specific behavior changes.

## Additional Notes
- See `CLAUDE.md` for architecture notes, key directories, and patterns like message routing and storage keys.
