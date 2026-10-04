(() => {
  const done = new Set();
  let running = false;
  let observer;

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.settings) reset();
  });

  async function settings() {
    const { settings = {} } = await chrome.storage.local.get("settings");
    return settings;
  }

  function tweetFrom(article) {
    const status = article.querySelector('a[href*="/status/"]');
    const id = status?.href.match(/\/status\/(\d+)/)?.[1];
    const text = article.querySelector('[data-testid="tweetText"]')?.innerText?.trim();
    const author = article.querySelector('[data-testid="User-Name"]')?.innerText?.trim();
    return id && text ? { id, text, author: author || "", url: status.href } : null;
  }

  function badge(article, label) {
    if (article.querySelector(".jev-label")) return;
    const target = article.querySelector('[data-testid="User-Name"]') || article;
    const node = document.createElement("span");
    node.className = "jev-label";
    node.textContent = `Jev · ${label}`;
    target.append(" ", node);
  }

  async function classify(article, config) {
    const tweet = tweetFrom(article);
    if (!tweet || done.has(tweet.id)) return;
    done.add(tweet.id);
    article.dataset.jevState = "checking";
    try {
      const result = await chrome.runtime.sendMessage({ type: "classify", tweet });
      if (result.error) throw new Error(result.error);
      if (result.match) badge(article, result.label);
    } catch (error) {
      console.warn("[Jev Labels]", error.message);
    } finally {
      delete article.dataset.jevState;
    }
  }

  async function scan() {
    if (running) return;
    const config = await settings();
    if (!config.enabled || !config.apiKey || !config.prompt?.trim()) return;
    running = true;
    try {
      for (const article of document.querySelectorAll('article[data-testid="tweet"]')) {
        await classify(article, config);
      }
    } finally {
      running = false;
    }
  }

  function reset() {
    done.clear();
    document.querySelectorAll(".jev-label").forEach(node => node.remove());
    scan();
  }

  chrome.runtime.onMessage.addListener(message => {
    if (message.type === "run") reset();
  });

  observer = new MutationObserver(() => scan());
  observer.observe(document.documentElement, { childList: true, subtree: true });
  scan();
})();
