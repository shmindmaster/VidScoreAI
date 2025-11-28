import type { PoolClient } from 'pg';
import { embedText } from './aiClient';
import { withClient, ensureSchema } from './db';

interface SeedDoc {
  id: string;
  title: string;
  content: string;
  metadata: Record<string, unknown>;
}

const seedDocuments: SeedDoc[] = [
  {
    id: 'kb-hooks-1',
    title: 'High-Performing Video Hooks',
    content:
      'Open with a strong pattern interrupt, a bold claim, or a direct question in the first 3 seconds. Keep the hook visually dynamic with close-up shots, on-screen text, or motion that stands out in the feed.',
    metadata: { category: 'hooks', level: 'beginner' },
  },
  {
    id: 'kb-pacing-1',
    title: 'Pacing and Retention Basics',
    content:
      'Maintain a brisk pace with cuts every 1-3 seconds for UGC-style ads. Remove dead air, long pauses, and redundant phrases. Use B-roll and overlays to keep visual interest high while voice-over continues the narrative.',
    metadata: { category: 'pacing', level: 'intermediate' },
  },
  {
    id: 'kb-cta-1',
    title: 'Effective Calls to Action',
    content:
      'State a clear CTA verbally and visually in the final 3-5 seconds. Reinforce with bold on-screen text and a supporting UI element like a button or swipe-up cue. Make the benefit explicit, not just the action.',
    metadata: { category: 'cta', funnelStage: 'conversion' },
  },
  {
    id: 'kb-overlays-1',
    title: 'Using Text Overlays for Clarity',
    content:
      'Use concise, high-contrast text overlays to reinforce key benefits and features. Ensure text is readable on mobile—avoid tiny fonts and low contrast. Time overlays so they remain on screen long enough to be read once or twice.',
    metadata: { category: 'visuals', focus: 'text-overlays' },
  },
  {
    id: 'kb-ugc-1',
    title: 'UGC Style that Converts',
    content:
      'Leverage authentic, handheld UGC footage with real customers or creators speaking directly to camera. Prioritize clarity of message, emotional relatability, and social proof over perfect production value.',
    metadata: { category: 'ugc', style: 'authentic' },
  },
];

async function upsertDocument(doc: SeedDoc, embedding: number[]): Promise<void> {
  await withClient(async (client: PoolClient) => {
    await client.query(
      `
        INSERT INTO vid_rag_documents (id, title, content, metadata, embedding, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, now(), now())
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          content = EXCLUDED.content,
          metadata = EXCLUDED.metadata,
          embedding = EXCLUDED.embedding,
          updated_at = now();
      `,
      [doc.id, doc.title, doc.content, doc.metadata, embedding]
    );
  });
}

async function main(): Promise<void> {
  // Ensure table and extension exist before seeding
  await ensureSchema();

  for (const doc of seedDocuments) {
    // eslint-disable-next-line no-console
    console.log(`Embedding document: ${doc.id} – ${doc.title}`);
    const [embedding] = await embedText(doc.content);
    await upsertDocument(doc, embedding);
    // eslint-disable-next-line no-console
    console.log(`Seeded document: ${doc.id}`);
  }

  // eslint-disable-next-line no-console
  console.log('RAG seeding complete.');
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('RAG seeding failed', err);
  process.exit(1);
});
