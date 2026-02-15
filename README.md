# Facebook Original Post Link Copier

## Description
This Chrome extension adds a fourth action button to Facebook posts so users can copy the original post link instantly.

## Features
- Works on Facebook home feed and search results.
- Adds "Copy Link" beside Like, Comment, and Share.
- Copies clean post URLs by removing tracking query parameters.
- Dynamically detects newly loaded posts with MutationObserver.
- Avoids duplicate buttons and supports light/dark mode.

## Privacy
- No personal data is collected, stored, or transmitted.
- No browsing history is tracked.
- The extension only runs on Facebook pages (`https://www.facebook.com/*`).
- Clipboard access is used only when you click the Copy button.

## Installation
1. Clone this repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" (toggle in the top-right corner).
4. Click "Load unpacked" and select the `facebook-original-link-copier` folder.

## Testing
1. Navigate to Facebook (https://www.facebook.com/).
2. Browse posts in Home Feed or Search Results.
3. Click the "Copy Link" button on a post.
4. Verify the URL is copied to the clipboard.

## Known Limitations
- May not work on posts loaded in certain modals.
- Requires clipboard permissions to copy URLs.

## Folder Structure
```
/facebook-original-link-copier
    manifest.json
    content.js
    styles.css
    popup.html
    popup.css
    popup.js
    icons/
```

## License
MIT License.