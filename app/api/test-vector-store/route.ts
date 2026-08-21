import { Document } from "@langchain/core/documents";
import { NextResponse } from "next/server";

import { vectorStore } from "@/lib/vector-store";

export const GET = async () => {
  const documents = [
    new Document({
      pageContent:
        "Employees receive 25 paid vacation days every calendar year.",
      metadata: {
        source: "company-policy.txt",
        section: "vacations",
      },
    }),
    new Document({
      pageContent:
        "Employees must submit vacation requests at least two weeks before their planned leave.",
      metadata: {
        source: "company-policy.txt",
        section: "vacations",
      },
    }),
    new Document({
      pageContent:
        "The company provides a laptop and a monitor to every new employee.",
      metadata: {
        source: "company-policy.txt",
        section: "equipment",
      },
    }),
  ];

  await vectorStore.addDocuments(documents);

  const results = await vectorStore.similaritySearch(
    "How many vacation days do employees have?",
    2,
  );

  return NextResponse.json({
    results,
  });
};
