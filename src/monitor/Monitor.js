import { xAccounts, rssFeeds, newsKeywords, brandContext } from '../config/sources.js';
import Parser from 'rss-parser';
import axios from 'axios';
import * as cheerio from 'cheerio';

const rssParser = new Parser();

export class Monitor {
  constructor() {
    this.collectedData = {
      timestamp: new Date().toISOString(),
      xPosts: [],
      rssArticles: [],
      news: [],
      githubTrending: [],
      keyDevelopments: []
    };
  }

  async run() {
    console.log('🔍 Starting AI landscape monitoring...');
    
    // Collect from all sources
    await Promise.all([
      this.monitorRSS(),
      this.monitorNews(),
      this.monitorGitHub(),
    ]);
    
    // Compile key developments
    this.compileDevelopments();
    
    console.log(`✅ Monitoring complete: ${this.collectedData.keyDevelopments.length} key developments found`);
    return this.collectedData;
  }

  async monitorRSS() {
    console.log('📰 Fetching RSS feeds...');
    const articles = [];
    
    for (const feed of rssFeeds.slice(0, 5)) { // Limit to prevent rate limiting
      try {
        const feedData = await rssParser.parseURL(feed);
        const recentItems = feedData.items
          .filter(item => {
            const pubDate = new Date(item.pubDate || item.isoDate);
            const hoursAgo = (Date.now() - pubDate.getTime()) / (1000 * 60 * 60);
            return hoursAgo < 48; // Last 48 hours
          })
          .slice(0, 3); // Top 3 per feed
        
        articles.push(...recentItems.map(item => ({
          source: feedData.title || 'RSS Feed',
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          summary: item.contentSnippet?.substring(0, 300) || ''
        })));
      } catch (err) {
        console.warn(`⚠️ RSS fetch failed for ${feed}: ${err.message}`);
      }
    }
    
    this.collectedData.rssArticles = articles;
    console.log(`  ✓ ${articles.length} RSS articles collected`);
  }

  async monitorNews() {
    console.log('📡 Fetching AI news...');
    
    // Use Hacker News API as a source
    try {
      const hnResponse = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
      const topIds = hnResponse.data.slice(0, 30);
      
      const stories = await Promise.all(
        topIds.map(async (id) => {
          try {
            const story = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
            return story.data;
          } catch (e) {
            return null;
          }
        })
      );
      
      // Filter for AI-related stories
      const aiStories = stories
        .filter(s => s && s.title)
        .filter(s => {
          const title = s.title.toLowerCase();
          return newsKeywords.some(kw => title.includes(kw.toLowerCase()));
        })
        .slice(0, 5)
        .map(s => ({
          source: 'Hacker News',
          title: s.title,
          link: s.url,
          score: s.score,
          comments: s.descendants
        }));
      
      this.collectedData.news = aiStories;
      console.log(`  ✓ ${aiStories.length} AI stories from HN`);
    } catch (err) {
      console.warn(`⚠️ News fetch failed: ${err.message}`);
    }
  }

  async monitorGitHub() {
    console.log('💻 Checking GitHub trending...');
    
    try {
      // Search for trending AI repos
      const response = await axios.get('https://api.github.com/search/repositories', {
        params: {
          q: 'artificial intelligence OR llm OR generative-ai created:>2024-01-01',
          sort: 'updated',
          order: 'desc',
          per_page: 10
        },
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      const repos = response.data.items.map(repo => ({
        name: repo.full_name,
        description: repo.description,
        stars: repo.stargazers_count,
        url: repo.html_url,
        language: repo.language
      }));
      
      this.collectedData.githubTrending = repos;
      console.log(`  ✓ ${repos.length} trending repos found`);
    } catch (err) {
      console.warn(`⚠️ GitHub fetch failed: ${err.message}`);
    }
  }

  compileDevelopments() {
    // Compile all sources into key developments
    const developments = [
      ...this.collectedData.rssArticles.map(a => ({
        type: 'news',
        title: a.title,
        source: a.source,
        url: a.link,
        summary: a.summary
      })),
      ...this.collectedData.news.map(n => ({
        type: 'trending',
        title: n.title,
        source: n.source,
        url: n.link,
        engagement: n.score
      })),
      ...this.collectedData.githubTrending.map(r => ({
        type: 'opensource',
        title: `${r.name}: ${r.description}`,
        source: 'GitHub',
        url: r.url,
        stars: r.stars
      }))
    ];
    
    // Sort by relevance and dedupe
    this.collectedData.keyDevelopments = developments
      .filter((v, i, a) => a.findIndex(t => t.title === v.title) === i)
      .slice(0, 15);
  }
}