import { chatModel } from "@/lib/chat-model";
import { getRagContext } from "@/lib/rag";

export const POST = async (request: Request) => {
  const { message } = await request.json();

  const { context } = await getRagContext(message);

  const prompt = `
You are a helpful document assistant.

Answer only using the context below.

If the answer is not available in the context, say:
"I could not find that information in the uploaded files."

Context:
${context}

User question:
${message}
`;
  const stream = await chatModel.stream(prompt);
  const encoder = new TextEncoder();
  //   the encoder we take normal string and convert it to bytes so we can send it over the network
  // here we define the stream
  const readableStream = new ReadableStream({
    async start(controller) {
      // the controller controll all stream operations such as enqueue to send new chunk or close or error
      for await (const chunk of stream) {
        const text = typeof chunk.content === "string" ? chunk.content : "";
        // this line will encode the text then send it to the browser as bytes
        controller.enqueue(encoder.encode(text));
      }

      controller.close();
    },
  });

  return new Response(readableStream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
};
