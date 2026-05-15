# Copilot Instructions — simple_proxy

This is a **Chrome extension (Manifest V3)** for domain-level proxy management. It uses React + TypeScript + Vite + MUI.

## Build & Dev Commands

- **Build:** `npm run build` (runs `tsc && vite build`, outputs to `dist/`)
- **Dev (watch):** `npm run dev` (runs `tsc && vite build --watch`)
- **Lint:** `npm run lint` (eslint with `--max-warnings 0`)
- **Test (watch):** `npm run test` (vitest in watch mode)
- **Test (single run):** `npm run test:run`
- **Run a single test file:** `npx vitest run src/utils/__tests__/gfwlist.test.ts`
- **Coverage:** `npm run test:coverage`

After building, load the `dist/` directory in Chrome via `chrome://extensions/` → "Load unpacked".

## Architecture

### Chrome Extension Contexts

The extension has three separate execution contexts that **do not share state directly**:

1. **Background service worker** (`src/background/index.ts`) — runs persistently, monitors web requests via `chrome.webRequest.onBeforeRequest`, tracks per-tab hosts using `TabCollection`, communicates with popup via `chrome.runtime.sendMessage` / `chrome.runtime.onConnect`.

2. **Popup UI** (`src/views/popup/`) — React app rendered when the user clicks the extension icon. Fetches hosts from the background service worker via messaging. No direct access to background state.

3. **Options page** (`src/views/options/`) — full-page React app for configuring proxy servers and managing proxy/bypass domain lists. Uses `react-router-dom` for navigation between sub-pages (proxy servers, proxy domains, bypass domains).

### Proxy Configuration Pipeline

`setProxyMode → updateProxyConfig → generateProxySettingObj → generatePac → chrome.proxy.settings.set`

The PAC script generation (`src/services/pacScript.ts`) is the core logic. It produces a `FindProxyForURL` JavaScript function that Chrome's proxy system evaluates for every request. In on-demand proxy mode with GFWList enabled, the PAC combines local proxy domain rules with fetched GFWList domains.

### Storage Split

- **`chrome.storage.local`** — proxy servers, proxy mode, GFWList content/cache, GFWList enabled flag. Larger data that doesn't need to sync across devices.
- **`chrome.storage.sync`** — proxy domain list, bypass domain list. Syncs across user's Chrome instances. Keep data size small here (sync has strict size limits).

### Host Tracking

`TabCollection` / `Tab` models (`src/models/`) maintain a `Set<string>` of hostnames per tab. The background script extracts hosts from every web request URL and notifies the popup (debounced, 300ms trailing) via `MESSAGE_HOSTS_UPDATE`.

## Key Conventions

- **Path alias:** `@` maps to `./src` (configured in `vitest.config.ts`). Use `@/` imports in tests.
- **Internationalization:** UI strings use `chrome.i18n.getMessage(key)`. Message definitions are in `public/_locales/*/messages.json`. Never hard-code user-facing English strings.
- **Constants pattern:** Storage keys, message names, proxy mode enums, and defaults live in `src/constants/`. Always use these constants — never reference raw string keys for `chrome.storage`.
- **Debounced updates:** Writes to proxy/bypass domain lists and proxy servers debounce `updateProxyConfig()` (500ms trailing) to avoid regenerating PAC on every keystroke.
- **Wildcard domains:** Proxy/bypass domain list entries support `*` wildcards (e.g., `*.google.com`). These are handled via `shExpMatch` in the generated PAC script, not in TypeScript logic.
- **GFWList integration:** GFWList is fetched as base64 from a remote URL, decoded client-side, parsed into domains, and optionally combined into the PAC script. Cached in `chrome.storage.local`. Only active in on-demand proxy mode.
- **TypeScript strictness:** `strict`, `noUnusedLocals`, `noUnusedParameters` are enabled. All unused variables/params must be explicitly acknowledged (e.g., prefix with `_`).
- **ESLint env:** `webextensions: true` is set — `chrome` global is recognized without explicit imports.