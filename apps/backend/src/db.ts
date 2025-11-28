import { Pool, PoolConfig, PoolClient } from 'pg';

let pool: Pool | null = null;

function createPool(): Pool {
  const connectionString = process.env.SHARED_PG_CONNECTION_STRING;

  if (!connectionString) {
    throw new Error('SHARED_PG_CONNECTION_STRING is not set');
  }

  const config: PoolConfig = {
    connectionString,
    max: 10,
    idleTimeoutMillis: 30_000,
  };

  return new Pool(config);
}

export function getPgPool(): Pool {
  if (!pool) {
    pool = createPool();
  }

  return pool;
}

export async function withClient<T>(
  fn: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await getPgPool().connect();

  try {
    return await fn(client);
  } finally {
    client.release();
  }
}

export async function ensureSchema(): Promise<void> {
  await withClient(async (client) => {
    await client.query('CREATE EXTENSION IF NOT EXISTS vector;');
    await client.query(`
      CREATE TABLE IF NOT EXISTS vid_rag_documents (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        metadata JSONB,
        embedding vector(1536) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      );
    `);
  });
}
