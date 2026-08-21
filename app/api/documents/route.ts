import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

export const GET = async () => {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await db.query<{
    id: string;
    file_name: string;
    mime_type: string;
    created_at: string;
    chunks_count: number;
  }>(
    `
      select
        documents.id,
        documents.file_name,
        documents.mime_type,
        documents.created_at,
        count(document_chunks.id)::int as chunks_count
      from documents
      left join document_chunks
        on document_chunks.document_id = documents.id
      where documents.user_id = $1
      group by documents.id
      order by documents.created_at desc
    `,
    [userId],
  );

  return Response.json({
    documents: result.rows,
  });
};
