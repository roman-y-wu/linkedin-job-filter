# Block Button Redesign - LinkedIn Style

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reposition the Block button below the company logo and style it identically to LinkedIn's "Saved" and "+OneClick" buttons.

**Architecture:** CSS-only changes to reposition and restyle the `.hns-block-button`. The button moves from its current position (next to company name) to below the company logo, matching LinkedIn's pill-shaped button style with matching font size and width.

**Tech Stack:** Pure CSS, no JavaScript changes needed.

---

## Task 1: Update Block Button Position and Dimensions

**Files:**
- Modify: `extension/content/content.css:105-154`

**Step 1: Update button positioning to be below company logo**

Change the `.hns-block-button` styles from:
```css
.hns-block-button {
  align-items: center !important;
  background: rgba(45, 45, 45, 0.9) !important;
  border: none !important;
  border-radius: 4px !important;
  color: #ffffff !important;
  cursor: pointer !important;
  display: flex !important;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
  font-size: 12px !important;
  font-weight: 600 !important;
  gap: 4px !important;
  height: 24px !important;
  left: 220px !important;
  padding: 0 8px !important;
  pointer-events: auto !important;
  position: absolute !important;
  top: 28px !important;
  transition: all 150ms ease-out !important;
  white-space: nowrap !important;
}
```

To:
```css
.hns-block-button {
  align-items: center !important;
  background: rgba(45, 45, 45, 0.95) !important;
  border: none !important;
  border-radius: 20px !important;
  box-sizing: border-box !important;
  color: #ffffff !important;
  cursor: pointer !important;
  display: flex !important;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  gap: 4px !important;
  height: 32px !important;
  justify-content: center !important;
  left: 8px !important;
  padding: 0 12px !important;
  pointer-events: auto !important;
  position: absolute !important;
  top: 80px !important;
  transition: background 150ms ease-out !important;
  white-space: nowrap !important;
  width: 72px !important;
}
```

Key changes:
- `top: 80px` - Position below the 72px company logo
- `left: 8px` - Align with left edge of logo
- `width: 72px` - Match company logo width
- `height: 32px` - Match LinkedIn button height
- `border-radius: 20px` - Pill shape like LinkedIn buttons
- `font-size: 14px` - Match LinkedIn button font size
- `justify-content: center` - Center the content

**Step 2: Update hover state to match LinkedIn style**

The hover state remains red for "danger" indication but with updated style:
```css
.hns-block-button:hover {
  background: rgba(200, 30, 30, 0.95) !important;
}
```

**Step 3: Update active state**

```css
.hns-block-button:active {
  background: rgba(170, 25, 25, 1) !important;
}
```

**Step 4: Update SVG icon size to match new button size**

Change:
```css
.hns-block-button svg {
  height: 14px !important;
  width: 14px !important;
}
```

To:
```css
.hns-block-button svg {
  height: 16px !important;
  width: 16px !important;
}
```

**Step 5: Remove transform from active state**

Remove the `transform` properties that are no longer needed:
```css
.hns-block-button:hover {
  background: rgba(200, 30, 30, 0.95) !important;
}

.hns-block-button:active {
  background: rgba(170, 25, 25, 1) !important;
}
```

**Step 6: Commit changes**

```bash
git add extension/content/content.css
git commit -m "style: reposition Block button below company logo with LinkedIn-style design"
```

---

## Task 2: Update Dark Mode Styles

**Files:**
- Modify: `extension/content/content.css:327-337`

**Step 1: Update dark mode block button styles**

Change the dark mode `.hns-block-button` styles from:
```css
.hns-block-button {
  background: rgba(55, 55, 55, 0.95) !important;
}

.hns-block-button:hover {
  background: rgba(220, 38, 38, 0.95) !important;
}

.hns-block-button:active {
  background: rgba(185, 28, 28, 1) !important;
}
```

To:
```css
.hns-block-button {
  background: rgba(60, 60, 60, 0.95) !important;
}

.hns-block-button:hover {
  background: rgba(200, 30, 30, 0.95) !important;
}

.hns-block-button:active {
  background: rgba(170, 25, 25, 1) !important;
}
```

**Step 2: Commit changes**

```bash
git add extension/content/content.css
git commit -m "style: update dark mode styles for Block button"
```

---

## Task 3: Manual Testing

**Step 1: Load the extension**

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `extension/` folder
4. Click the refresh icon on the extension card

**Step 2: Test on LinkedIn Jobs**

1. Navigate to LinkedIn Jobs: https://www.linkedin.com/jobs/
2. Search for any job (e.g., "Data Scientist")
3. Verify the Block button appears:
   - Below the company logo
   - Same width as the company logo (~72px)
   - Pill-shaped with rounded corners
   - Font size matches Saved/OneClick buttons
   - Centered text with icon

**Step 3: Test hover and click states**

1. Hover over the Block button - should turn red
2. Click the Block button - should show darker red
3. Verify the blocking functionality still works

**Step 4: Test dark mode**

1. Enable dark mode in system preferences or LinkedIn settings
2. Verify button styling looks correct in dark mode

---

## Summary of All Changes

| Property | Before | After |
|----------|--------|-------|
| `top` | `28px` | `80px` |
| `left` | `220px` | `8px` |
| `width` | (auto) | `72px` |
| `height` | `24px` | `32px` |
| `border-radius` | `4px` | `20px` |
| `font-size` | `12px` | `14px` |
| `justify-content` | (none) | `center` |
| SVG size | `14px` | `16px` |
