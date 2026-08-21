import { chatModel } from "@/lib/chat-model";

export const POST = async (request: Request) => {
  const { message } = await request.json();

  const stream = await chatModel.stream(message);

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
