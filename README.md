# Yapgator Website and Public Releases

Official Robinhood Chain/Pons pre-launch website for Yapgator.

## Verified destinations

- Website: `https://yapgator.com`
- Community: `https://t.me/YapgatorOfficial`
- Bot: `https://t.me/YapgatorSwampBot`
- X: `https://x.com/YAPGAT0R` (`@YAPGAT0R`)

The required GitHub Pages CNAME is `yapgator.com`. Do not modify DNS.

## Central public models

- `data/project-status.json`: versioned normalized launch/market model shared conceptually by the website, Android app and bot.
- `data/announcements.json`: validated official announcement feed.
- `data/app-release.json`: verified native Android release metadata.

Production remains `prelaunch`. Contract, launch destination, chart, explorer, graduation target/progress and all financial fields remain `null` until independently verified. Null is never rendered as zero.

## Native Android release

The signed native Kotlin/Jetpack Compose APK is published under `downloads/` with a SHA-256 sidecar. Download controls activate only after `app-release.json` validates. Signing keys and credentials never belong in this repository.

## Data behavior

The browser validates every field and official HTTPS URL, retains the previous valid result during temporary failures, marks stale data, pauses polling while hidden, and never generates market values or progress. State transitions require verified configuration. The service worker removes all older Yapgator caches, uses network-first navigation, and caches only versioned static assets.

## Safety

Never commit secrets, tokens, API keys, private keys, signing keys, keystores, seed phrases, passwords, login codes, private endpoints or credentials.
