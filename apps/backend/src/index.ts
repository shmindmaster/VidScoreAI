import express, { Request, Response } from "express";
import cors from "cors";
import { z } from "zod";
import type { PoolClient } from "pg";
import { embedText } from "./aiClient";
import { withClient, ensureSchema } from "./db";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: (process.env.CORS_ORIGINS || "*")
      .split(",")
      .map((o: string) => o.trim())
      .filter(Boolean),
  })
);

const PORT = process.env.PORT || 3001;

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

const indexSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
  metadata: z.record(z.any()).optional(),
});

app.post("/api/rag/index", async (req: Request, res: Response) => {
  try {
    const parsed = indexSchema.parse(req.body);

    const [embedding] = await embedText(parsed.content);

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
        [parsed.id, parsed.title, parsed.content, parsed.metadata ?? {}, embedding]
      );
    });

    res.status(200).json({ success: true });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: error.issues });
    }

    // eslint-disable-next-line no-console
    console.error("/api/rag/index error", error);
    res.status(500).json({ success: false, error: "Failed to index document" });
  }
});

const searchSchema = z.object({
  query: z.string().min(1),
  limit: z.number().int().positive().max(50).optional(),
});

app.post("/api/rag/search", async (req: Request, res: Response) => {
  try {
    const { query, limit = 5 } = searchSchema.parse(req.body);

    const [embedding] = await embedText(query);
    const vectorStr = `[${embedding.join(",")}]`;

    const rows = await withClient(async (client: PoolClient) => {
      const result = await client.query(
        `
          SELECT
            id,
            title,
            content,
            metadata,
            1 - (embedding <=> $1::vector) AS score
          FROM vid_rag_documents
          WHERE embedding IS NOT NULL
          ORDER BY embedding <=> $1::vector
          LIMIT $2;
        `,
        [vectorStr, limit]
      );
      return result.rows as Array<{
        id: string;
        title: string;
        content: string;
        metadata: unknown;
        score: number;
      }>;
    });

    res.status(200).json({
      success: true,
      data: {
        query,
        results: rows.map((row) => ({
          id: row.id,
          title: row.title,
          content: row.content,
          metadata: row.metadata ?? {},
          score: Number(row.score ?? 0),
        })),
      },
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: error.issues });
    }

    // eslint-disable-next-line no-console
    console.error("/api/rag/search error", error);
    res.status(500).json({ success: false, error: "RAG search failed" });
  }
});

ensureSchema()
  .then(() => {
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`VidScoreAI backend listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error("Failed to initialize schema", err);
    process.exit(1);
  });
