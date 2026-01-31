import { Telegraf } from 'telegraf';

export class Deliverer {
  constructor(botToken, chatId) {
    this.bot = new Telegraf(botToken);
    this.chatId = chatId;
  }

  async deliver(content) {
    console.log('📬 Delivering content package...');
    
    const date = new Date().toLocaleDateString('en-GB', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    // Send header
    await this.sendMessage(`🌅 *Good Morning Chris!*

📅 *${date}*
🤖 *AI Content Brief*

${content.dailyBrief}

━━━━━━━━━━━━━━━━━━━━━━━

📝 *${content.trends.length} Content Opportunities Ready*`);
    
    // Send each trend's content
    for (let i = 0; i < content.trends.length; i++) {
      const trend = content.trends[i];
      await this.sendTrendContent(i + 1, trend);
    }
    
    // Send closing
    await this.sendMessage(`━━━━━━━━━━━━━━━━━━━━━━━

✅ *All content ready for review*

Reply with:
• "post 1 linkedin" - I'll refine and format for posting
• "more" - Generate additional angles
• "skip" - Skip this trend

_Next brief: Tomorrow 8 AM_`);
    
    console.log('✅ Delivery complete');
  }

  async sendTrendContent(index, trendData) {
    const trend = trendData.trend;
    const platforms = trendData.platforms;
    
    // Main trend header
    await this.sendMessage(`\n📊 *OPPORTUNITY #${index}*

*${trend.title}*

💡 ${trend.summary}

🎯 *Business Angle:* ${trend.businessAngle}

🔥 *Contrarian Take:* ${trend.contrarianTake}`);
    
    // Platform content (truncate if too long)
    for (const [platform, data] of Object.entries(platforms)) {
      if (data.content && data.content !== 'Generation failed') {
        const emoji = this.getPlatformEmoji(platform);
        const truncated = this.truncate(data.content, 3500);
        
        await this.sendMessage(`${emoji} *${platform.toUpperCase()}*
\`\`\`
${truncated}
\`\`\``);
      }
    }
    
    await this.sendMessage(`➖➖➖➖➖➖➖➖➖➖➖➖➖➖`);
  }

  getPlatformEmoji(platform) {
    const emojis = {
      linkedin: '💼',
      substack: '📰',
      x: '🐦',
      instagram: '📸',
      youtube: '🎬'
    };
    return emojis[platform.toLowerCase()] || '📝';
  }

  truncate(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '\n\n[... truncated]';
  }

  async sendMessage(text) {
    try {
      await this.bot.telegram.sendMessage(this.chatId, text, {
        parse_mode: 'Markdown',
        disable_web_page_preview: true
      });
      // Small delay to prevent rate limiting
      await new Promise(r => setTimeout(r, 500));
    } catch (err) {
      console.error('Delivery error:', err.message);
      // Try without markdown if it fails
      try {
        await this.bot.telegram.sendMessage(this.chatId, text.replace(/[*`]/g, ''));
      } catch (e) {
        console.error('Failed to send message');
      }
    }
  }
}