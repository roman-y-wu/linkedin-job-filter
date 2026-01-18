# **Hide LinkedIn Jobs**

Filter out unwanted job listings on LinkedIn by company, keyword, or promoted status.

## **Usage**

- The first time you use Hide LinkedIn Jobs, you'll need to grant permissions. You'll see a yellow alert notification bubble next to the extension icon on your browser's toolbar. Click the icon and then click "Enable Hide LinkedIn Jobs on LinkedIn".

- "Block" buttons are added next to every listing. Click to hide unwanted jobs. By default, listings are hidden behind an overlay. You can completely remove them from view by enabling "Do not display hidden jobs".

- Click a job's "block" button to hide all jobs from that company.

- Click the toolbar button for additional options:
  - Block jobs by keyword (supports regular expressions like `/part[\s-]?time/i`)
  - View and manage your list of hidden jobs
  - Click "Unhide all jobs" to reset (with undo option)
  - Toggle "Do not display hidden jobs" to remove listings entirely
  - Access settings for backup/restore, permissions, and release notes

## **Features**

- Block by company name
- Block by keyword or regex pattern
- Block promoted/sponsored job listings
- Hide jobs behind overlay or remove completely
- Backup and restore your settings
- Dark mode support (follows system preference)

## **Privacy**

Your data remains completely private. All data is stored locally on your device and may sync across devices if browser synchronization is enabled.

## **Permissions**

"Read and change your data on LinkedIn sites" - Required to add block buttons and overlays to job listings.

## **Development**

No build process required. Pure ES6 modules with vanilla JavaScript.

To test changes:
1. Load extension in Chrome: `chrome://extensions/` → Enable "Developer mode" → "Load unpacked" → select `extension/` folder
2. Click refresh icon after code changes
3. Refresh LinkedIn job search page

## **Release Notes**

### 8.2.0 (2025-12-22)
- Update listing detection for new LinkedIn layout
- Add option to disable release notes popup after updates
- Apply light/dark theme to release notes based on device preference
- Fix duplicated overlays on blocked listings

### 8.1.0 (2025-12-12)
- Backup and restore now available for Firefox
- Settings page with job board permissions, release notes, and data management

### 8.0.0 (2025-12-11)
- Show extension info popup on install/update
- Adjust listing detection for LinkedIn job collections
- Reload page when LinkedIn job collection iframe is detected

### 7.1.3 (2025-12-07)
- Fix company name detection on LinkedIn company job pages

### 7.1.2 (2025-11-28)
- Fix old keyword toggles not being removed from listings

### 7.1.1 (2025-11-26)
- Fix search popup job search query not being executed

### 7.1.0 (2025-11-25)
- Add permission request buttons to job search popup

### 7.0.0 (2025-11-23)
- Optional permissions (requested when needed, not on install)

### 6.0.0 (2025-11-03)
- Block jobs by keyword with regex support

### 5.1.4 (2025-03-27)
- Update company name detection for LinkedIn

### 5.0.0 (2024-07-28)
- Backup and restore functionality
