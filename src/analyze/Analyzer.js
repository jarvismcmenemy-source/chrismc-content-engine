import Anthropic from '@anthropic-ai/sdk';
import { systemPrompt, analysisPrompt } from '../config/prompts.js';

export class Analyzer {
  constructor(apiKey) {
    this.anthropic = new Anthropic({ apiKey });
  }

  async analyze(monitoringData) {
    console.log('🧠 Analyzing AI developments for content opportunities...');
    
    const prompt = analysisPrompt(monitoringData.keyDevelopments);
    
    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4000,
        system: systemPrompt,
        messages: [{ role: 'user', content: prompt }]
      });
      
      const text = response.content[0].text;
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        console.log(`✅ Analysis complete: ${analysis.trends?.length || 0} trends identified`);
        return analysis;
      }
      
      throw new Error('Could not parse analysis JSON');
    } catch (err) {
      console.error('❌ Analysis failed:', err.message);
      return { trends: [], dailyBrief: 'Analysis unavailable' };
    }
  }
}