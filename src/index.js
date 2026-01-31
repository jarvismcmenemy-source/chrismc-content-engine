import { Monitor } from './monitor/Monitor.js';
import { Analyzer } from './analyze/Analyzer.js';
import { Generator } from './generate/Generator.js';
import { Deliverer } from './deliver/Deliverer.js';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

class ContentEngine {
  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY;
    this.botToken = process.env.TELEGRAM_BOT_TOKEN;
    this.chatId = process.env.TELEGRAM_CHAT_ID;
    
    if (!this.apiKey) {
      throw new Error('ANTHROPIC_API_KEY required');
    }
    
    this.monitor = new Monitor();
    this.analyzer = new Analyzer(this.apiKey);
    this.generator = new Generator(this.apiKey);
    this.deliverer = this.botToken ? new Deliverer(this.botToken, this.chatId) : null;
  }

  async run() {
    console.log('🚀 ChrisMc Content Engine Starting...\n');
    const startTime = Date.now();
    
    try {
      // Step 1: Monitor
      const monitoringData = await this.monitor.run();
      
      // Step 2: Analyze
      const analysis = await this.analyzer.analyze(monitoringData);
      
      // Step 3: Generate
      const content = await this.generator.generateAll(analysis);
      
      // Step 4: Save to file
      await this.saveContent(content);
      
      // Step 5: Deliver
      if (this.deliverer) {
        await this.deliverer.deliver(content);
      } else {
        console.log('\n📄 Content saved to output/ (no Telegram delivery configured)');
      }
      
      const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
      console.log(`\n✅ Complete! Duration: ${duration} minutes`);
      
    } catch (err) {
      console.error('❌ Engine failed:', err);
      process.exit(1);
    }
  }
  
  async saveContent(content) {
    const outputDir = 'output';
    await fs.mkdir(outputDir, { recursive: true });
    
    const date = new Date().toISOString().split('T')[0];
    const filename = path.join(outputDir, `content-brief-${date}.json`);
    
    await fs.writeFile(filename, JSON.stringify(content, null, 2));
    console.log(`💾 Content saved: ${filename}`);
  }
}

// Run if called directly
const engine = new ContentEngine();
engine.run();