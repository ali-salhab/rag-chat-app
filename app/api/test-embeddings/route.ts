import { NextResponse } from "next/server";
import { embeddings } from "@/lib/embeddings";

function cosineSimilarity(vectorA: number[], vectorB: number[]) {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
    magnitudeA += vectorA[i] * vectorA[i];
    magnitudeB += vectorB[i] * vectorB[i];
  }

  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}

export async function GET() {
  const ragVector = await embeddings.embedQuery(
    "I am learning how to build a RAG system",
  );

  const similarVector = await embeddings.embedQuery(
    "I want to create an AI application that answers from documents",
  );

  const unrelatedVector = await embeddings.embedQuery(
    "My favorite meal is pizza",
  );

  return NextResponse.json({
    ragAndSimilar: cosineSimilarity(ragVector, similarVector),
    ragAndUnrelated: cosineSimilarity(ragVector, unrelatedVector),
    // rag: ragVector,
  });
}
