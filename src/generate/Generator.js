import Anthropic from '@anthropic-ai/sdk';
import { 
  systemPrompt, 
  linkedinPrompt, 
  substackPrompt, 
  xPrompt, 
  instagramPrompt, 
  youtubePrompt 
} from '../config/prompts.js';

export class Generator {
  constructor(apiKey) {
    this.anthropic = new Anthropic({ apiKey });
  }

  async generateAll(analysis) {
    console.log('✍️ Generating content for all platforms...');
    
    const content = {
      timestamp: new Date().toISOString(),
      dailyBrief: analysis.dailyBrief,
      trends: []
    };
    
    // Generate content for top 3 trends
    const topTrends = analysis.trends?.slice(0, 3) || [];
    
    for (const trend of topTrends) {
      console.log(`  📝 Generating content for: ${trend.title}`);
      
      const trendContent = {
        trend: trend,
        platforms: {}
      };
      
      // Generate for each platform in parallel
      const [linkedin, substack, x, instagram, youtube] = await Promise.all([
        this.generateLinkedIn(trend),
        this.generateSubstack(trend),
        this.generateX(trend),
        this.generateInstagram(trend),
        this.generateYouTube(trend)
      ]);
      
      trendContent.platforms = {
        linkedin,
        substack,
        x,
        instagram,
        youtube
      };
      
      content.trends.push(trendContent);
    }
    
    console.log(`✅ Content generation complete: ${content.trends.length} trends → 5 platforms each`);
    return content;
  }

  async generateLinkedIn(trend) {
    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1500,
        system: systemPrompt,
        messages: [{ role: 'user', content: linkedinPrompt(trend) }]
      });
      return { content: response.content[0].text, platform: 'LinkedIn' };
    } catch (err) {
      return { content: 'Generation failed', platform: 'LinkedIn', error: err.message };
    }
  }

  async generateSubstack(trend) {
    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 2000,
        system: systemPrompt,
        messages: [{ role: 'user', content: substackPrompt(trend) }]
      });
      return { content: response.content[0].text, platform: 'Substack' };
    } catch (err) {
      return { content: 'Generation failed', platform: 'Substack', error: err.message };
    }
  }

  async generateX(trend) {
    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 2000,
        system: systemPrompt,
        messages: [{ role: 'user', content: xPrompt(trend) }]
      });
      return { content: response.content[0].text, platform: 'X' };
    } catch (err) {
      return { content: 'Generation failed', platform: 'X', error: err.message };
    }
  }

  async generateInstagram(trend) {
    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1500,
        system: systemPrompt,
        messages: [{ role: 'user', content: instagramPrompt(trend) }]
      });
      return { content: response.content[0].text, platform: 'Instagram' };
    } catch (err) {
      return { content: 'Generation failed', platform: 'Instagram', error: err.message };
    }
  }

  async generateYouTube(trend) {
    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 2000,
        system: systemPrompt,
        messages: [{ role: 'user', content: youtubePrompt(trend) }]
      });
      return { content: response.content[0].text, platform: 'YouTube' };
    } catch (err) {
      return { content: 'Generation failed', platform: 'YouTube', error: err.message };
    }
  }
}