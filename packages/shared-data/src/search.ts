/**
 * Search client stubs for VidScoreAI.
 *
 * Azure AI Search has been removed from this application. When backend
 * search/RAG is implemented, it should use Postgres + pgvector on the
 * shared Postgres host instead of Azure Search indexes.
 */

export function getSearchClient(_indexName: string): never {
  throw new Error(
    "Azure AI Search has been removed from VidScoreAI. Implement Postgres+pgvector-based search instead."
  );
}

export function getSearchIndexClient(): never {
  throw new Error(
    "Azure AI Search index management has been removed from VidScoreAI. Use Postgres+pgvector for search/RAG."
  );
}

