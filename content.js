class Entry {
  constructor(text, levelsUp) {
    this.text = text;
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
    const spans = Array.from(document.querySelectorAll("span"));
    const matches = spans.filter((span) => {
      return span.textContent.trim().toLowerCase() === entry.text.toLowerCase();
    });
    matches.forEach((span) => {
      let target = span;
      for (let i = 0; i < entry.levelsUp; i++) {
        if (target?.parentElement) target = target.parentElement;
      }

      if (target && target.parentElement) {
        const placeholder = document.createElement("div");
        placeholder.style.display = "none";
        target.parentElement.replaceChild(placeholder, target);
      }
    });
  });
}

const observer = new MutationObserver((mutations) => {
  mutations.forEach(() => {
    clean();
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
