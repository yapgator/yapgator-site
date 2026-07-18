# Yapgator Website

Static pre-launch website for Yapgator on Robinhood Chain through Pons.

## Official destinations

- Website: `https://yapgator.com`
- Telegram: `https://t.me/YapgatorOfficial` (`@YapgatorOfficial`)
- X: `https://x.com/YAPGAT0R`

Only `yapgator.com` is configured as the GitHub Pages custom domain. Do not modify DNS.

## Launch configuration

All public launch-sensitive values live in `assets/js/config.js` under `window.YAPGATOR_CONFIG`. Contract address, Pons token URL, chart URL, explorer URL, market-data API URL, Telegram statistics API URL, live financial data, and graduation progress remain blank or null until verified.

The UI derives three modes from that configuration:

1. `prelaunch`: the mascot idles at Launch Dock and no numerical progress is shown.
2. `live` with a valid contract and graduation data: movement follows clamped graduation progress.
3. `graduated: true`: movement follows milestone-segmented logarithmic market-cap progress.

Future actions only render after their HTTPS URLs pass validation. Market data is normalized, cached in memory after success, marked stale after the configured interval, and never replaced with generated values or false zeroes. Polling pauses while the page is hidden.

## Safety

Never commit secrets, tokens, keys, seed phrases, passwords, login codes, private endpoints, or credentials. The browser configuration must contain public information only.

## Local test

```sh
python3 -m http.server 8080
```

Then inspect at desktop and responsive widths of 768, 412, 390, and 360 pixels.
