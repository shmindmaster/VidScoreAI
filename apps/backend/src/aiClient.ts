import OpenAI from 'openai';

export type ChatModel = 'gpt-5.1';
export type EmbeddingModel = 'text-embedding-3-small';
export type ImageModel = 'gpt-image-1-mini';

const endpoint =
  process.env.AZURE_OPENAI_ENDPOINT ??
  'https://shared-openai-eastus2.openai.azure.com/openai/v1/';

const apiKey = process.env.AZURE_OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('AZURE_OPENAI_API_KEY is not set');
}

export const openai = new OpenAI({
  baseURL: endpoint,
  apiKey,
});

export async function embedText(
  input: string | string[],
  modelOverride?: EmbeddingModel
): Promise<number[][]> {
  const model: EmbeddingModel =
    modelOverride ||
    (process.env.AZURE_OPENAI_EMBEDDING_MODEL as EmbeddingModel) ||
    'text-embedding-3-small';

  const res = await openai.embeddings.create({
    model,
    input,
  });

  return res.data.map((item) => item.embedding);
}
