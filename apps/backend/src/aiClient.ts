/**
 * Azure OpenAI Responses API Client
 * Uses direct HTTP calls instead of OpenAI SDK
 */

export type ChatModel = 'gpt-5.1-codex-mini';
export type EmbeddingModel = 'text-embedding-3-small';
export type ImageModel = 'gpt-image-1-mini';

const endpoint = process.env.AZURE_OPENAI_ENDPOINT || 
  'https://shared-openai-eastus2.cognitiveservices.azure.com/';

const apiKey = process.env.AZURE_OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('AZURE_OPENAI_API_KEY is not set');
}

const embeddingEndpoint = process.env.AZURE_OPENAI_EMBEDDING_ENDPOINT ||
  `${endpoint.replace(/\/$/, '')}/openai/deployments/text-embedding-3-small/embeddings?api-version=2023-05-15`;

/**
 * Generate embeddings using Azure OpenAI Embedding API
 * @param input - Text or array of texts to embed
 * @param modelOverride - Optional model override (defaults to text-embedding-3-small)
 * @returns Array of embedding vectors
 */
export async function embedText(
  input: string | string[],
  modelOverride?: EmbeddingModel
): Promise<number[][]> {
  const model: EmbeddingModel =
    modelOverride ||
    (process.env.AI_MODEL_EMBEDDING as EmbeddingModel) ||
    'text-embedding-3-small';

  // Use the embedding endpoint (standard endpoint, not Responses API)
  const url = embeddingEndpoint.replace(
    'text-embedding-3-small',
    model
  );

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      input: Array.isArray(input) ? input : [input],
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Embedding API error: ${res.status} - ${errorText}`);
  }

  const data = await res.json();
  
  if (!data.data || !Array.isArray(data.data)) {
    throw new Error('Invalid embedding response format');
  }

  return data.data.map((item: { embedding: number[] }) => item.embedding);
}
