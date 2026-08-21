import { embeddings } from "@/lib/embeddings";
import { db } from "@/lib/db";

const vectorToSql = (vector: number[]) => {
  return `[${vector.join(",")}]`;
};

type RetrievedChunk = {
  content: string;
  metadata: {
    source?: string;
    chunkIndex?: number;
  };
  similarity: number;
};

export const getRagContext = async (question: string, userId: string) => {
  const questionVector = await embeddings.embedQuery(question);

  const result = await db.query<RetrievedChunk>(
    `
      select
        content,
        metadata,
        1 - (embedding <=> $2::vector) as similarity
      from document_chunks
      where user_id = $1
      order by embedding <=> $2::vector
      limit 4
    `,
    [userId, vectorToSql(questionVector)],
  );

  const context = result.rows
    .map(
      (chunk, index) => `
Source ${index + 1}: ${chunk.metadata.source ?? "Unknown file"}
Content:
${chunk.content}
`,
    )
    .join("\n---\n");

  return {
    context,
    sources: result.rows,
  };
};
