import { ChatOllama } from "@langchain/ollama";

export const chatModel = new ChatOllama({
  model: "gemma3:4b",
  baseUrl: "http://127.0.0.1:11434",
  temperature: 0,
});
