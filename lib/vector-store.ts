import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";

import { embeddings } from "@/lib/embeddings";

export const vectorStore = new MemoryVectorStore(embeddings);
