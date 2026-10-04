# Jev Labels for X

A zero-build Chrome extension that checks visible X posts against a prompt using TypeSafe's Jev model on OpenRouter and adds a badge to matches.

## Install

1. Open `chrome://extensions` and enable **Developer mode**.
2. Click **Load unpacked** and select this `x-jev-labeler` folder.
3. Choose one API-key source:
   - Copy `config.example.js` to `config.local.js`, add `openRouterApiKey`, then reload the extension. The local config is ignored by Git.
   - Or paste an OpenRouter API key into the extension popup. It overrides `config.local.js` and is stored in `chrome.storage.local` for this Chrome profile.
4. Set a badge label and prompt, then enable it.
5. Open X and click **Run visible posts**. New timeline posts are checked while enabled.

The extension sends post text, author text, and URL to OpenRouter to obtain each decision.

## Example

- Label: `Good idea`
- Prompt: `Does this post contain a concrete, practical insight about building products with AI?`

To change a rule, edit the prompt or label; the current page is rechecked. Disable the toggle to stop new requests.
