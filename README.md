# Jev Labels for X

A zero-build Chrome extension that checks visible X posts against a prompt using TypeSafe's Jev model on OpenRouter and adds a badge to matches.

## Install

1. Download and unzip `jev-labels-for-x-1.0.0.zip` from the [latest release](https://github.com/anishthite/x-jev-labeler/releases/latest), or clone this repository.
2. Open `chrome://extensions` and enable **Developer mode**.
3. Click **Load unpacked** and select the unzipped `x-jev-labeler` folder.
4. Choose one API-key source:
   - Copy `config.example.js` to `config.local.js`, add `openRouterApiKey`, then reload the extension. The local config is ignored by Git.
   - Or paste an OpenRouter API key into the extension popup. It overrides `config.local.js` and is stored in `chrome.storage.local` for this Chrome profile.
5. Set a badge label and prompt, then enable it.
6. Open X and click **Run visible posts**. New timeline posts are checked while enabled.

The extension sends post text, author text, and URL to OpenRouter to obtain each decision.

## Example

- Label: `Good idea`
- Prompt: `Does this post contain a concrete, practical insight about building products with AI?`

To change a rule, edit the prompt or label; the current page is rechecked. Disable the toggle to stop new requests.
