import { auth } from "@clerk/nextjs/server";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

import { embeddings } from "@/lib/embeddings";
import { createDocumentWithChunks } from "@/lib/repositories/document";

export const runtime = "nodejs";

export const POST = async (request: Request) => {
  const { userId } = await auth();
  console.log("userId", userId);
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return Response.json({ error: "Please select a file" }, { status: 400 });
  }

  if (!file.name.toLowerCase().endsWith(".txt")) {
    return Response.json(
      { error: "Only TXT files are supported currently" },
      { status: 400 },
    );
  }

  if (file.size > 2 * 1024 * 1024) {
    return Response.json(
      { error: "The file must be smaller than 2 MB" },
      { status: 400 },
    );
  }

  const text = await file.text();

  if (!text.trim()) {
    return Response.json(
      { error: "The selected file is empty" },
      { status: 400 },
    );
  }

  const userUploadDirectory = path.join(process.cwd(), "uploads", userId);

  await mkdir(userUploadDirectory, {
    recursive: true,
  });

  const storedFileName = `${crypto.randomUUID()}.txt`;

  const storagePath = path.join(userUploadDirectory, storedFileName);

  const fileBuffer = Buffer.from(await file.arrayBuffer());

  await writeFile(storagePath, fileBuffer);

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 800,
    chunkOverlap: 120,
  });

  const chunks = await splitter.splitText(text);

  const vectors = await embeddings.embedDocuments(chunks);

  const result = await createDocumentWithChunks({
    userId,
    fileName: file.name,
    mimeType: file.type || "text/plain",
    storagePath,
    chunks: chunks.map((content, index) => ({
      content,
      embedding: vectors[index],
      metadata: {
        source: file.name,
        chunkIndex: index,
      },
    })),
  });

  return Response.json(result, {
    status: 201,
  });
};
