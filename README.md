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

## File Structure

```text
index.html
404.html
CNAME
.gitignore
.nojekyll
robots.txt
sitemap.xml
site.webmanifest
assets/css/styles.css
assets/js/app.js
assets/images/favicon.svg
assets/images/yapgator-hero.jpg
```

## Preview Locally

From the repository root:

```bash
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173/`.

## Launch Configuration

All launch-sensitive states are controlled at the top of `assets/js/app.js`:

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

Add future values only in that object:

- Telegram group URL: `telegramGroupUrl`
- Pump.fun launch URL: `pumpFunUrl`
- Contract address: `contractAddress`
- Chart URL: `chartUrl`
- Launch date: `launchDate`
- Live launch wording: set `launched` to `true`

When a value is empty, the website automatically keeps its Coming Soon state active. Telegram community buttons, buy buttons, chart links, and copy-contract controls stay disabled until their matching values are added.

## GitHub Pages Publishing

Publish with GitHub Pages using:

- Repository: `yapgator/yapgator-site`
- Branch: `main`
- Folder: repository root `/`
- Custom domain: `yapgator.com`

Keep the `CNAME` file in the repository root. Do not configure the alternate redirect domains in GitHub Pages.

## Security Boundaries

Never commit Telegram bot tokens, API keys, private keys, wallet seed phrases, wallet secrets, passwords, `.env` files, server credentials, or GitHub tokens.

Telegram bot code does not belong in this repository. It belongs in `/root/yapgator-bot`.

Keep this website separate from unrelated automation or token-operation repositories.
