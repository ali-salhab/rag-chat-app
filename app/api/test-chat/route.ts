import { NextResponse } from "next/server";
import { chatModel } from "@/lib/chat-model";

export async function GET() {
  const response = await chatModel.invoke(
    "Explain RAG in one short sentence in arabic language.",
  );

  return NextResponse.json({
    answer: response.content ?? null,
  });
}
