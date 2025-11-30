import { PrismaClient } from '@prisma/client';
import { AzureOpenAI } from 'openai';
import 'dotenv/config';

// Import pg and PrismaPg using require for better compatibility with ts-node in monorepos
const pg = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false } // Required for Azure PostgreSQL flexible server
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const client = new AzureOpenAI({
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  apiVersion: '2024-05-01-preview',
  deployment: 'text-embedding-3-small', // Ensure this matches your deployment name
});

const KNOWLEDGE_DATA = [
  {
    title: 'Vertical Video Dominance (9:16)',
    content: 'For maximum performance on Instagram Reels, TikTok, and Facebook Feed, strictly use a 9:16 aspect ratio (1080x1920). Vertical video occupies the full mobile screen, increasing immersion and click-through rates compared to square (1:1) or landscape (16:9) formats. Meta recommends 4:5 for Feed and Stories dominance.'
  },
  {
    title: 'The 3-Second Hook Rule',
    content: 'The first 3-5 seconds are critical for retention. Start with a pattern interrupt, provocative question, or high-contrast visual to stop the scroll. High early watch time signals success to algorithms. Avoid slow intros.'
  },
  {
    title: 'Text Overlay Best Practices',
    content: 'Use bold, high-contrast text overlays (e.g., black text on white background) for key points, as many watch with sound off. Ensure text is within safe zones to avoid UI element overlap. Captions are mandatory for sound-off viewers.'
  },
  {
    title: 'Pacing and Visual Rhythm',
    content: 'Maintain viewer attention by changing visuals or cuts every 3-5 seconds. Avoid static shots longer than this to prevent drop-offs. Quick cuts and dynamic transitions enhance engagement.'
  },
  {
    title: 'Native vs. Highly Produced Content',
    content: 'On platforms like TikTok, \'lo-fi\' or UGC-style content often outperforms polished ads. Aim for authenticity and a native feel to the platform. For Instagram, a balance between polish and spontaneity works best.'
  },
  {
    title: 'Call-to-Action (CTA) Strategy',
    content: 'Include a clear graphical CTA at the end. Verbalize offers (\'Click link below\') and use on-screen pointers to guide users. Test different CTA phrasing and placement for maximum conversion.'
  },
  {
    title: 'Testing Variations',
    content: 'Iterate on video hooks (first 3s) and test 3-5 visual variations (e.g., different hooks, CTAs, pacing) to find what resonates best with your audience. Weekly iteration yields performance lifts.'
  },
  {
    title: 'Sound Design & Music',
    content: 'Use trending audio or clear voiceovers. Ensure videos are understandable with sound off (captions are mandatory). Dynamic audio enhances emotional connection and memorability.'
  },
  {
    title: 'Platform-Specific Optimization',
    content: 'Remove watermarks from other platforms (e.g., TikTok watermark on Reels). Leverage native editing tools like AR filters, text overlays, Duets/Stitch (TikTok), Remix (Instagram), and YouTube Shorts features for better engagement and algorithm favor.'
  },
  {
    title: 'Content Repurposing Strategy',
    content: "Break down long-form content into short clips or adapt successful clips for multiple platforms (TikTok, Reels, Shorts) with minor modifications. This maximizes reach and saves production time."
  },
  {
    title: 'User-Generated Content (UGC) Integration',
    content: 'Feature authentic customer reviews, testimonials, or UGC to build trust and community. Encourage participation via hashtag campaigns. UGC often has high engagement and perceived authenticity.'
  },
  {
    title: 'Mobile-First Design & Formatting',
    content: 'Film and edit in vertical (9:16) format. Ensure text is readable on mobile screens, and test on various devices. Use safe zones for text to avoid UI element overlap. Always check aspect ratio compatibility.'
  },
  {
    title: 'AI-Driven Performance Analysis',
    content: 'Utilize AI for video analysis to score performance (hook, pacing, CTA, visuals) and generate actionable recommendations. This provides data-driven insights for optimization. Be transparent about AI use in marketing.'
  },
  {
    title: 'Meta Ads Best Practices (Billo.app)',
    content: 'Use 4:5 vertical format for Feed and Story dominance. Serious tone, interviews, and drama hooks often outperform playful formats. Bold, high-contrast captions and graphic CTAs boost silent-view retention and clicks. Product PNG overlays and magnifying effects drive visual engagement. Iterate weekly on scripts and visuals for performance lifts.'
  },
  {
    title: 'AdRoll Video Specs & Engagement', 
    content: 'Ideal video duration: 15-20 seconds, up to 30s. Resolution: 1080p recommended. Aspect Ratios: 9:16 Vertical is ideal for mobile. Captions are crucial for sound-off viewing. Hook in first 3 seconds. Ensure CTAs are not covered by UI elements.'
  },
  {
    title: 'Facebook Video Ad Specs (QuickFrame)',
    content: 'Story Ads: Up to 2 mins vertical (1080x1080px), pace into 15s cards; lead with a thumb-stopping hook. Feed Vertical: Supports 1080x1920 (9:16). Carousel: Treat each card distinctly with unique visuals, headlines, and CTAs.'
  },
  {
    title: 'Social Media Content Strategy (RecurPost)',
    content: 'Captions should grab attention, provide value, and have a clear CTA. Maintain visual consistency with brand colors and logos. Use relevant hashtags for discoverability. Microblogs on LinkedIn for insights.'
  },
  {
    title: 'Explainer Video ROI KPIs (Mooviemakers)',
    content: 'Focus on micro-conversions like CTA clicks. Define success metrics before publishing. Track engagement and conversions to measure ROI. Use interactive video tools for better CTA engagement.'
  },
  {
    title: 'Short-Form Video Trends (Taggbox)',
    content: 'Platforms like TikTok, Reels, Shorts, Snapchat Spotlight, and Triller are key. UGC, trends, behind-the-scenes, product teasers, influencer ads, and educational content are popular formats. Repurposing content across platforms is effective. Trends should fit brand message.'
  },
  {
    title: 'StackInfluence Best Practices', 
    content: 'Authenticity wins on TikTok. Polish matters more on Reels. YouTube Shorts benefit from search optimization and can link to longer content. Leverage micro-influencers for reach and engagement. Test video variations regularly. Optimize for TikTok SEO: use keywords in captions and on-screen text.'
  },
  {
    title: 'TikTok Algorithm & Discoverability',
    content: 'Prioritize strong completion rates and replays. Focus on niche engagement and relevant hashtags. Leverage platform features like Duets & Stitch. Use app editing tools and trending sounds.'
  },
  {
    title: 'Instagram Reels Algorithm & Discoverability',
    content: 'Prioritize original, high-quality content. Use native editing tools and trending audio. Leverage Reels\' shareability and follower growth potential. Consider collaborations for cross-promotion. Avoid TikTok watermarks.'
  },
  {
    title: 'YouTube Shorts Algorithm & Discoverability',
    content: 'Balance viral potential with search optimization. Use descriptive titles/descriptions with keywords. Encourage channel subscriptions and views of longer content. Focus on value/entertainment and user engagement signals. Optimize timing for audience activity.'
  },
  {
    title: 'AI-Generated Content Best Practices',
    content: 'Use high-quality AI-assisted ads, guided by skilled teams. Be transparent about AI use. AI can generate personalized product demos based on search queries. Monitor AI-generated content for cultural sensitivity.'
  }
];

async function main() {
  console.log('Seeding Knowledge Base with enriched data...');

  for (const item of KNOWLEDGE_DATA) {
    console.log(`Processing: ${item.title}`);

    try {
      const embeddingResponse = await client.embeddings.create({
        model: 'text-embedding-3-small', // Ensure this matches your deployment name
        input: item.content,
      });

      const embedding = embeddingResponse.data[0].embedding;
      
      // Format vector for pgvector (string '[x,y,z]')
      const vectorString = `[${embedding.join(',')}]`;

      // Use ON CONFLICT (title) DO NOTHING to prevent duplicates if script is run multiple times
      await prisma.$executeRaw`
        INSERT INTO knowledge_base (id, title, content, embedding, "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), ${item.title}, ${item.content}, ${vectorString}::vector, NOW(), NOW())
        ON CONFLICT (title) DO NOTHING;
      `;

    } catch (e) {
      // Log error but continue seeding other items
      console.error(`Failed to process ${item.title}:`, e);
    }
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });