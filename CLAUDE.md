# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Hide n' Seek is a browser extension (Chrome/Firefox) that hides unwanted job listings on LinkedIn, Indeed, and Glassdoor. Built with vanilla JavaScript using Manifest V3.

## Development

**No build process** - Pure ES6 modules, no bundler or npm dependencies.

**To test changes:**
1. Load extension in Chrome: `chrome://extensions/` → Enable "Developer mode" → "Load unpacked" → select `extension/` folder
2. Click refresh icon on extension card after code changes
3. Refresh the job board page

**Manual testing required** - Test on actual job board pages (LinkedIn Jobs, Indeed, Glassdoor).

## Architecture

Three execution contexts communicate via Chrome messaging API:

```
Content Scripts (job board pages)     Popup UI (extension icon click)
        ↓                                      ↓
        └──────→ Background Service Worker ←───┘
                 (message router, state)
```

### Key Directories

- `extension/content/` - Injected into job board pages, handles UI overlays and blocking
- `extension/runtime/popup/` - Popup when clicking extension icon
- `extension/runtime/background/` - Service worker for message routing
- `extension/runtime/modules/` - Shared utilities (storage, job board configs, permissions)

### Core Files

- `runtime/modules/job-boards.js` - Job board definitions with CSS selectors and attribute configs
- `content/classes/attribute-blocker.js` - Core blocking logic per attribute type
- `content/classes/element-collector.js` - DOM mutation observer for detecting job listings
- `runtime/modules/storage.js` - Storage with chunking to handle quota limits

## Key Patterns

### Storage Keys
```
JobAttributeManager.{jobBoardId}.{attributeId}.blockedJobAttributeValues
JobDisplayManager.{jobBoardId}.removeHiddenJobs
JobDisplayManager.{jobBoardId}.hideSymbols
```

### Message Routing
```javascript
// Background registers handler
addMessageListener("get job board", ({ message, sendResponse }) =>
  sendResponse(getJobBoardByHostname(message.data.hostname))
);

// Content/popup sends message
const jobBoard = await chrome.runtime.sendMessage({
  request: "get job board",
  data: { hostname: location.hostname }
});
```

### CSS-Driven State
Display preferences use data attributes on `<html>` element:
```css
html[data-hns-hide-symbols="true"] .hns-container { display: none; }
```

### Job Board Configuration
Each board in `job-boards.js` defines:
- `domains` - URL patterns
- `listingSelector` - CSS to find job cards
- `attributes` - Blockable properties (Company, Keyword, Status) with selectors and processors

## Adding a New Job Board

1. Add config to `runtime/modules/job-boards.js`:
```javascript
{
  domains: ["newsite.com"],
  id: "newSite",
  listingSelector: "selector-for-job-cards",
  attributes: [{
    name: "Company",
    id: "companyName",
    match: "exact",
    selector: "selector-for-company-name",
    processors: [trim],
    default: true
  }]
}
```
2. Extension auto-requests permissions when user visits the domain
3. Blocking UI appears automatically

## Adding a New Setting Toggle

Follow the `RemoveHiddenJobsManager` pattern:
1. Add checkbox to `popup.html`
2. Create manager class in `popup/classes/` (handles storage sync)
3. Import/instantiate in `job-board-popup.js`
4. Add DOM attribute handling in `content/modules/job-listings.js`
5. Add CSS rule in `content/content.css`
