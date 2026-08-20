import { OllamaEmbeddings } from "@langchain/ollama";

export const embeddings = new OllamaEmbeddings({
  model: "nomic-embed-text",
  baseUrl: "http://127.0.0.1:11434",
});
