import { db } from "@/lib/db";

type ChunkToInsert = {
  content: string;
  embedding: number[];
  metadata: Record<string, unknown>;
};

type CreateDocumentInput = {
  userId: string;
  fileName: string;
  mimeType: string;
  storagePath: string;
  chunks: ChunkToInsert[];
};

const vectorToSql = (vector: number[]) => {
  return `[${vector.join(",")}]`;
};

export const createDocumentWithChunks = async (input: CreateDocumentInput) => {
  const client = await db.connect();

  try {
    await client.query("begin");

    const documentResult = await client.query<{
      id: string;
      file_name: string;
    }>(
      `
        insert into documents (
          user_id,
          file_name,
          mime_type,
          storage_path
        )
        values ($1, $2, $3, $4)
        returning id, file_name
      `,
      [input.userId, input.fileName, input.mimeType, input.storagePath],
    );

    const document = documentResult.rows[0];

    for (const chunk of input.chunks) {
      await client.query(
        `
          insert into document_chunks (
            document_id,
            user_id,
            content,
            embedding,
            metadata
          )
          values ($1, $2, $3, $4::vector, $5::jsonb)
        `,
        [
          document.id,
          input.userId,
          chunk.content,
          vectorToSql(chunk.embedding),
          JSON.stringify(chunk.metadata),
        ],
      );
    }

    await client.query("commit");

    return {
      documentId: document.id,
      fileName: document.file_name,
      chunksCreated: input.chunks.length,
    };
  } catch (error) {
    await client.query("rollback");

    throw error;
  } finally {
    client.release();
  }
};
