// Facebook Original Post Link Copier - Content Script

(function () {
  const BUTTON_CLASS = "fb-original-link-btn";
  const ACTION_CELL_CLASS = "fb-original-link-action-cell";
  const PROCESSED_ATTR = "data-processed";

  // Utility to create the "Copy Original URL" button
  function createButton() {
    const button = document.createElement("button");
    button.type = "button";
    button.className = BUTTON_CLASS;
    button.textContent = "Copy Link";
    return button;
  }

  function createActionCell(templateCell) {
    const actionCell = document.createElement("div");
    if (templateCell?.className) {
      actionCell.className = templateCell.className;
    }
    actionCell.classList.add(ACTION_CELL_CLASS);
    return actionCell;
  }

  // Extract the canonical URL from a post
  function extractCanonicalUrl(post) {
    const timestampAnchor = post.querySelector("a[href*='/posts/'], a[href*='/permalink/'], a[href*='/groups/'], a[href*='/reel/']");
    const href = timestampAnchor?.href;
    if (href && !href.includes("/share/")) {
      try {
        const cleanUrl = href.split("?")[0]; // Remove everything after the first question mark
        return cleanUrl;
      } catch (error) {
        console.error("Failed to clean URL", error);
        return href; // Fallback to the original URL
      }
    }
    return null;
  }

  // Updated addButtonToPost to prevent duplication
  function addButtonToPost(post) {
    if (post.hasAttribute(PROCESSED_ATTR)) return; // Skip if already processed
    if (post.querySelector(`.${BUTTON_CLASS}`)) {
      post.setAttribute(PROCESSED_ATTR, "true");
      return;
    }

    const url = extractCanonicalUrl(post);
    if (!url) return;

    const button = createButton();
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(url);
        button.textContent = "Copied";
        setTimeout(() => (button.textContent = "Copy Link"), 1600);
      } catch (err) {
        console.error("Failed to copy URL", err);
        button.textContent = "Failed";
        setTimeout(() => (button.textContent = "Copy Link"), 1600);
      }
    });

    // Prefer insertion as a 4th action right after Share
    const shareMarker = post.querySelector("[data-ad-rendering-role='share_button']");
    const shareButton = shareMarker?.closest("[role='button']");
    const shareCell = shareButton?.parentElement;

    if (shareCell && shareCell.parentElement && !post.querySelector(`.${BUTTON_CLASS}`)) {
      const actionCell = createActionCell(shareCell);
      actionCell.appendChild(button);
      shareCell.insertAdjacentElement("afterend", actionCell);
      post.setAttribute(PROCESSED_ATTR, "true");
      return;
    }

    // Fallback insertion if Share button is unavailable
    const actionBar = post.querySelector("[role='button']")?.parentElement || post;
    if (actionBar && !actionBar.querySelector(`.${BUTTON_CLASS}`)) {
      actionBar.appendChild(button);
      post.setAttribute(PROCESSED_ATTR, "true");
    }
  }

  // Enhanced MutationObserver to handle both search results and home page posts
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Check for posts in search results and home page
          const posts = node.querySelectorAll("div[role='article'], div[data-pagelet^='FeedUnit_'] div[role='article']");
          posts.forEach((post) => {
            console.debug("Processing post:", post); // Debugging log
            addButtonToPost(post);
          });

          // If the node itself is a post
          if (node.getAttribute("role") === "article" || node.closest("div[data-pagelet^='FeedUnit_']")) {
            console.debug("Processing single post:", node); // Debugging log
            addButtonToPost(node);
          }
        }
      });
    });
  });

  // Fallback: Process existing posts on page load
  window.addEventListener("load", () => {
    console.debug("Fallback: Processing existing posts on page load");
    const existingPosts = document.querySelectorAll("div[role='article']");
    existingPosts.forEach((post) => {
      console.debug("Processing existing post:", post);
      addButtonToPost(post);
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();