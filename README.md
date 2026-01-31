# ChrisMc Content Engine 🤖✍️

AI-powered social monitoring and content generation system. Runs nightly, delivers content ideas by 8 AM.

## What It Does

1. **Monitors** - Watches AI developments from curated X accounts, news sources, RSS feeds
2. **Analyzes** - Identifies trends, insights, and content opportunities  
3. **Generates** - Creates platform-specific content:
   - LinkedIn articles (long-form thought leadership)
   - Substack articles (newsletter content)
   - X/Twitter posts (threads and standalone)
   - Instagram images + captions (via nano-banana-pro)
   - YouTube tutorial ideas (titles, outlines, scripts)
4. **Delivers** - Packages everything and sends via Telegram at 8 AM

## Daily Output

Each morning you'll receive:
- **AI Trend Report** - What happened yesterday in AI
- **Content Recommendations** - 3-5 pieces tailored to your voice
- **Ready-to-post formats** - Formatted for each platform
- **Visual assets** - Generated images where applicable

## Setup

```bash
npm install
cp .env.example .env
# Edit .env with your API keys
npm run daily  # Manual run
```

## Scheduled Runs

Automatic execution at 6 AM (delivers by 8 AM):
```bash
# MacOS launchd (recommended)
launchctl load ~/Library/LaunchAgents/com.chrismc.content-engine.plist
```

## Architecture

```
src/
├── config/          # Sources, accounts, prompts
├── monitor/         # Data collection modules
├── analyze/         # Trend detection & insight extraction
├── generate/        # Content creation for each platform
├── assets/          # Image generation via nano-banana
└── deliver/         # Telegram delivery
```

## Customization

Edit `src/config/sources.js` to add/remove monitoring sources.
Edit `src/config/prompts.js` to adjust content style and tone.

---

*Built for ChrisMc personal brand*