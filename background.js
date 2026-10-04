try { importScripts("config.local.js"); } catch { /* Optional local development config. */ }

const DEFAULTS = { enabled: false, label: "Jev", prompt: "", apiKey: "" };

chrome.runtime.onInstalled.addListener(async () => {
  const { settings } = await chrome.storage.local.get("settings");
  if (!settings) await chrome.storage.local.set({ settings: DEFAULTS });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type !== "classify") return;
  classify(message.tweet).then(sendResponse).catch(error => sendResponse({ error: error.message }));
  return true;
});

async function classify(tweet) {
  const { settings = DEFAULTS } = await chrome.storage.local.get("settings");
  const apiKey = settings.apiKey || globalThis.JEV_CONFIG?.openRouterApiKey;
  if (!apiKey) throw new Error("Add an OpenRouter API key in config.local.js or the extension popup.");
  if (!settings.prompt.trim()) throw new Error("Add a prompt in the extension popup.");

  const response = await fetch("https://openrouter.ai/api/alpha/decisions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "~typesafe/jev-latest",
      state: { tweet },
      questions: {
        match: {
          type: "choice",
          instructions: `Decide whether this X post matches this rule: ${settings.prompt}\nChoose match only when it does; otherwise choose skip.`,
          criteria: {
            match: "The post matches the user rule.",
            skip: "The post does not match the user rule."
          }
        }
      }
    })
  });

  if (!response.ok) throw new Error(`OpenRouter returned ${response.status}.`);
  const body = await response.json();
  return { match: body.answers?.match?.choice === "match", label: settings.label.trim() || "Jev" };
}
