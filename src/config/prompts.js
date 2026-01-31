// Content generation prompts for each platform

export const systemPrompt = `You are an elite content strategist and ghostwriter for Chris McMenemy, a serial entrepreneur building an AI studio (VALO) and personal brand (ChrisMc).

Chris's Brand:
- Builder who actually ships (not just talks)
- Scale-focused (systems over hustle)
- Escape artist (broke free from traditional paths)
- Pragmatic (real results, not theory)
- Background: Maritime entrepreneur → AI tech
- Current: Building VALO Studios, fractional CRO, content creator

Content Style:
- Professional but approachable
- Contrarian takes welcome
- Frameworks over fluff
- Real examples and results
- "Building in public" transparency
- Occasional humor and personality

Your job: Transform AI news/developments into content ideas that align with Chris's brand and provide value to his audience.`;

export const analysisPrompt = (sources) => `Analyze these AI developments from the last 24 hours:

${JSON.stringify(sources, null, 2)}

Identify:
1. The 3-5 most significant developments
2. Business implications (not just technical)
3. Contrarian angles or underexplored perspectives
4. How this relates to Chris's expertise (AI implementation, business transformation)
5. Content opportunities for each platform

Output as JSON:
{
  "trends": [
    {
      "title": "Brief trend name",
      "summary": "What happened (1-2 sentences)",
      "significance": "Why it matters",
      "businessAngle": "Business implication",
      "contrarianTake": "Different perspective",
      "contentIdeas": {
        "linkedin": "Specific angle for LinkedIn",
        "substack": "Newsletter topic",
        "x": "Tweet or thread concept",
        "youtube": "Tutorial idea"
      }
    }
  ],
  "dailyBrief": "3-4 sentence executive summary"
}`;

export const linkedinPrompt = (trend) => `Create a LinkedIn article outline based on this AI development:

${JSON.stringify(trend)}

Requirements:
- Hook in first 2 lines (pattern interrupt or contrarian)
- Personal angle or framework
- 3-5 key points with supporting evidence
- Clear takeaway/actionable insight
- End with question to drive engagement
- Total: 150-300 words (readable in feed)

Output format:
TITLE: [Catchy title]
HOOK: [Opening lines]
BODY:
- Point 1
- Point 2  
- Point 3
TAKEAWAY: [Key insight]
CTA: [Engagement question]`;

export const substackPrompt = (trend) => `Create a Substack article outline:

${JSON.stringify(trend)}

Requirements:
- Compelling headline (curiosity gap or promise)
- Introduction: personal story or strong hook
- 5-7 sections with clear subheads
- Practical frameworks or mental models
- Real examples (Chris's experience or case studies)
- Clear conclusion with next steps
- 800-1500 words when written

Output as structured outline with key points per section.`;

export const xPrompt = (trend) => `Create X/Twitter content:

${JSON.stringify(trend)}

Create 3 options:
1. SINGLE TWEET: Punchy, under 280 chars, hot take or insight
2. MINI-THREAD: 3-5 tweets, narrative arc, one key idea
3. MEGA-THREAD: 8-12 tweets, comprehensive breakdown, strong opener

Each must be complete (no "click to read more"). Include engagement hooks.`;

export const instagramPrompt = (trend) => `Create Instagram content:

${JSON.stringify(trend)}

Requirements:
1. IMAGE CONCEPT: Describe what image to generate (for nano-banana)
2. CAROUSEL OUTLINE: If applicable, 5-10 slides breaking down the concept
3. CAPTION: Engaging caption with hook, value, CTA
4. HASHTAGS: 5-10 relevant hashtags

Style: Motivational, educational, or behind-the-scenes. Visual-first thinking.`;

export const youtubePrompt = (trend) => `Create YouTube tutorial concept:

${JSON.stringify(trend)}

Requirements:
- TITLE: Clickable but not clickbait
- THUMBNAIL CONCEPT: What to show
- HOOK: First 30 seconds (pattern interrupt)
- OUTLINE: 5-10 key sections with timestamps
- SCRIPT KEY POINTS: Bullet points for each section
- CTA: Subscribe + engagement prompt

Focus: Educational, "how to" or "why it matters" angle. Actionable content.`;

export const imagePrompt = (content) => `Generate an image for this social media post:

${content}

Create a detailed image generation prompt suitable for nano-banana-pro (Gemini 3 Pro Image). 

Style options based on content:
- Inspirational/motivational: Cinematic, dramatic lighting, professional
- Educational: Clean, infographic-style, clear visuals
- Behind-the-scenes: Authentic, candid, natural lighting
- Contrarian/thought-provoking: Abstract, conceptual, artistic

Output just the image generation prompt (100-200 words describing scene, style, mood, composition).`;