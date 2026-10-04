const $ = id => document.getElementById(id);
const fields = ["apiKey", "label", "prompt", "enabled"];

document.addEventListener("DOMContentLoaded", async () => {
  const { settings = {} } = await chrome.storage.local.get("settings");
  fields.forEach(id => { $(id).value = settings[id] || ""; });
  $("enabled").checked = Boolean(settings.enabled);
  fields.forEach(id => $(id).addEventListener("change", save));
  $("run").addEventListener("click", run);
});

async function save() {
  const { settings = {} } = await chrome.storage.local.get("settings");
  const next = {
    ...settings,
    apiKey: $("apiKey").value.trim(),
    label: $("label").value.trim(),
    prompt: $("prompt").value.trim(),
    enabled: $("enabled").checked
  };
  await chrome.storage.local.set({ settings: next });
  show("Saved.", "ok");
}

async function run() {
  $("enabled").checked = true;
  await save();
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url?.match(/^https:\/\/(x|twitter)\.com\//)) {
    show("Open X first.", "error");
    return;
  }
  await chrome.tabs.sendMessage(tab.id, { type: "run" });
  show("Running on visible posts.", "ok");
}

function show(message, kind) {
  const status = $("status");
  status.textContent = message;
  status.className = kind;
}
