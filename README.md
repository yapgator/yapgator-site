# YAPGATOR Website

Static launch website for **YAPGATOR** (`$YAPGATOR`), a community-driven Solana meme coin preparing to launch through Pump.fun.

## Project Identity

- Brand: YAPGATOR
- Ticker: `$YAPGATOR`
- Network: Solana
- Launch platform: Pump.fun
- Primary domain: `https://yapgator.com/`
- Official X: `@YAPGAT0R`
- Official X URL: `https://x.com/YAPGAT0R`
- Official Telegram bot: `@YapgatorOfficialBot`
- Official Telegram bot URL: `https://t.me/YapgatorOfficialBot`

## Domains

Only `yapgator.com` should be configured as the GitHub Pages custom domain. The repository root `CNAME` file contains exactly:

```text
yapgator.com
```

The alternate domains `yapgator.fun`, `yapigator.com`, and `yapigator.fun` already redirect externally to `https://yapgator.com/`. Do not configure those as GitHub Pages custom domains and do not modify their DNS or forwarding rules from this repository.

## Artwork Assignments

Current local artwork assignments are centralized in `assets/js/app.js`:

- `assets/images/yapgator-hero.jpg`: main hero artwork.
- `assets/images/yapgator-roadmap.png`: atmospheric layer for the Gator Map.
- `assets/images/yapgator-market.png`: Launch Command Center artwork.
- `assets/images/yapgator-community.png`: Community and Official Links artwork.
- `assets/images/yapgator-new-2.png`: intentionally unassigned and unused. Keep the file, but do not display it.
- `assets/images/pump-logomark.svg`: local Pump.fun footer asset when available.
- `assets/images/favicon.svg`: local Yapgator gator-eye emblem.

Do not recompress, recolor, crop permanently, or otherwise modify the image pixels unless that is a separate explicit design task.

## Launch Configuration

All launch-sensitive values live at the top of `assets/js/app.js` in `launchConfig`:

```js
const launchConfig = {
  launched: false,
  launchDate: "",
  xUrl: "https://x.com/YAPGAT0R",
  telegramGroupUrl: "",
  telegramBotUrl: "https://t.me/YapgatorOfficialBot",
  pumpFunUrl: "",
  contractAddress: "",
  chartUrl: "",
  network: "Solana",
  platform: "Pump.fun",
  totalSupply: "1,000,000,000",
  decimals: "6",
  graduation: "PumpSwap"
};
```

Blank optional values are hidden from the visible layout. The site does not show disabled fake buttons or placeholder token links.

To update launch values later:

- Pump.fun coin URL: set `launchConfig.pumpFunUrl`.
- Contract address: set `launchConfig.contractAddress`.
- Chart URL: set `launchConfig.chartUrl`.
- Telegram community URL: set `launchConfig.telegramGroupUrl`.
- Launch date: set `launchConfig.launchDate` only after there is a confirmed public date.
- Live launch state: set `launchConfig.launched` to `true` only after launch.

Do not enter fake contract addresses, token mints, chart URLs, market prices, market capitalization, volume, holder counts, transaction counts, launch dates, or milestone values.

## Market Data Configuration

Future live-market support is prepared in `marketDataConfig`:

```js
const marketDataConfig = {
  enabled: false,
  endpoint: "",
  tokenMint: "",
  refreshIntervalMs: 30000
};
```

While `enabled` is `false`, the live-feed component remains hidden and the browser makes no market-data request.

To enable a future feed:

1. Choose a public client-safe endpoint.
2. Add the endpoint to `marketDataConfig.endpoint`.
3. Add the public token mint to `marketDataConfig.tokenMint` if the endpoint requires it.
4. Set `marketDataConfig.enabled` to `true`.
5. Return data shaped for `updateMarketData(data)` with numeric `price`, `marketCap`, `volume24h`, `bondingCurveProgress`, and a `lastUpdated` value.

Never add API keys, private endpoints, server credentials, or secrets to this static repository.

## Roadmap Configuration

The Gator Map is driven by `roadmapConfig`:

```js
const roadmapConfig = {
  currentMarketCap: null,
  milestones: [
    { targetMarketCap: "", title: "GATOR WAKES UP", description: "The first yaps hit the timeline." }
  ]
};
```

The moving alligator uses the configured route SVG path. When `currentMarketCap` is `null`, it stays near the start and no milestone is marked complete. When valid future market-cap data is supplied through `updateMarketData(data)`, the script compares it only against configured numeric milestone targets and marks genuinely achieved milestones.

Leave `targetMarketCap` blank until real public milestone targets are approved.

## Static Architecture

The site is fully static and uses only:

- HTML
- CSS
- Vanilla JavaScript
- Inline SVG
- Local image assets

Do not add React, Next.js, Vue, Angular, npm, yarn, pnpm, server rendering, a backend, wallet-connect code, trading widgets, analytics, trackers, or third-party JavaScript frameworks.

## Preview Locally

From the repository root:

```bash
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173/`.

## Security Boundaries

Never commit Telegram bot tokens, API keys, private keys, wallet seed phrases, wallet secrets, passwords, `.env` files, server credentials, or GitHub tokens.

Telegram bot code and tokens do not belong in this repository.

Keep this website separate from unrelated automation, token-operation, or bot repositories. Do not inspect or reference prohibited project contents from this site.

## GitHub Pages Publishing

Publish with GitHub Pages using:

- Repository: `yapgator/yapgator-site`
- Branch: `main`
- Folder: repository root `/`
- Custom domain: `yapgator.com`

Keep the `CNAME` file in the repository root. Do not configure the alternate redirect domains in GitHub Pages.
