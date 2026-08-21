import { vectorStore } from "@/lib/vector-store";

export const getRagContext = async (question: string) => {
  const relevantDocuments = await vectorStore.similaritySearch(question, 4);

  const context = relevantDocuments
    .map(
      (document, index) =>
        `Source ${index + 1} (${document.metadata.source}):\n${document.pageContent}`,
    )
    .join("\n\n---\n\n");

  return {
    context,
    sources: relevantDocuments.map((document) => document.metadata),
  };
};
