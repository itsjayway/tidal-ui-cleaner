class Entry {
  constructor(text, levelsUp) {
    this.text = text;
    this.textLower = text.toLowerCase();
    this.levelsUp = levelsUp;
  }
}

const BLOCKED_TEXT_AND_DEPTH = [
  new Entry("Spotlighted Uploads", 4),
  new Entry("Recommended new tracks", 4),
  new Entry("Popular playlists on TIDAL", 2),
  new Entry("Albums you'll enjoy", 2),
];

function clean() {
  BLOCKED_TEXT_AND_DEPTH.forEach((entry) => {
    const spans = document.querySelectorAll("span");
    spans.forEach((span) => {
      if (
        span.dataset.cleanedByTidalCleaner ||
        span.textContent.trim().toLowerCase() !== entry.textLower
      ) {
        return;
      }

      let target = span;
      for (let i = 0; i < entry.levelsUp; i++) {
        if (target?.parentElement) target = target.parentElement;
      }

      if (target && target.parentElement) {
        span.dataset.cleanedByTidalCleaner = "true";
        const placeholder = document.createElement("div");
        placeholder.style.display = "none";
        target.parentElement.replaceChild(placeholder, target);
      }
    });
  });
}

let debounceTimer;
const observer = new MutationObserver((mutations) => {
  let shouldClean = false;
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (
        node.nodeType === 1 &&
        node.querySelector &&
        node.querySelector("span")
      ) {
        shouldClean = true;
        break;
      }
    }
  }
  if (shouldClean) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(clean, 300);
  }
});

observer.observe(document.body, { childList: true, subtree: true });

window.addEventListener("load", clean);
