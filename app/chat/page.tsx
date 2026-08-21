"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  useEffect(() => {
    const container = messagesContainerRef.current;
    const topElement = topObserverRef.current;

    if (!container || !topElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeaderHidden(!entry.isIntersecting);
      },
      {
        root: container,
        threshold: 0,
      },
    );

    observer.observe(topElement);

    return () => observer.disconnect();
  }, []);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLElement>(null);
  const topObserverRef = useRef<HTMLDivElement>(null);
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const question = input.trim();

    if (!question || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: question,
    };

    const assistantMessageId = crypto.randomUUID();

    const emptyAssistantMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
    };

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
      emptyAssistantMessage,
    ]);

    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: question,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to start the AI response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const textChunk = decoder.decode(value, {
          stream: true,
        });

        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            message.id === assistantMessageId
              ? {
                  ...message,
                  content: message.content + textChunk,
                }
              : message,
          ),
        );
      }
    } catch (error) {
      console.error(error);

      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          message.id === assistantMessageId
            ? {
                ...message,
                content:
                  "Sorry, an error occurred while generating the answer.",
              }
            : message,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col h-dvh   text-white">
      <header
        className={`shrink-0 overflow-hidden border-b-2 border-zinc-800 bg-amber-400 transition-all duration-300 ease-in-out ${
          isHeaderHidden
            ? "max-h-0 -translate-x-full border-transparent opacity-0"
            : "max-h-24 translate-x-0 opacity-100"
        }`}
      >
        <div className="mx-auto max-w-3xl p-2">
          <h1 className="text-lg font-semibold">Local RAG Chat</h1>
          <p className="text-sm text-zinc-600">Ollama + LangChain</p>
        </div>
      </header>

      <section
        ref={messagesContainerRef}
        className="mx-auto     flex w-full max-w-3xl flex-1 flex-col gap-4 overflow-y-auto px-2"
      >
        <div ref={topObserverRef} className="h-1 bg-blue-400 shrink-0" />
        {messages.length === 0 && (
          <div className="mt-20 text-center text-zinc-400">
            Ask your local AI a question.
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={
              message.role === "user"
                ? "ml-auto max-w-[80%] rounded-2xl bg-blue-600 px-4 py-3"
                : "mr-auto max-w-[80%] rounded-2xl bg-zinc-800 px-4 py-3"
            }
          >
            {message.content || "Thinking..."}
          </div>
        ))}
      </section>

      <form
        onSubmit={handleSubmit}
        className="border-t shrink-0  border-zinc-800 p-4"
      >
        <div className="mx-auto flex max-w-3xl gap-3">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask a question..."
            disabled={isLoading}
            className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none placeholder:text-zinc-500 focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="rounded-xl bg-blue-600 px-5 py-3 font-medium transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </main>
  );
}
