import { chatModel } from "@/lib/chat-model";
import { getRagContext } from "@/lib/rag";
import { auth } from "@clerk/nextjs/server";

export const POST = async (request: Request) => {
  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const { message } = await request.json();

  const { context } = await getRagContext(message, userId);
  const prompt = `
أنت مساعد تجيب فقط من المعلومات الموجودة داخل السياق.

اتبع قاعدة واحدة فقط:

1. إذا كان السياق يحتوي جواب السؤال:
أعطِ الجواب فقط باللغة العربية.
لا تقل أبدًا إنك لم تجد المعلومة.

2. إذا كان السياق لا يحتوي جواب السؤال:
أجب بهذه الجملة فقط:
"لم أجد هذه المعلومة في الملفات المرفوعة."

لا تكتب الجواب الصحيح ثم تضيف جملة عدم العثور على المعلومة.
لا تستخدم أي معرفة خارج السياق.

<context>
${context}
</context>

السؤال:
${message}
`;

  const stream = await chatModel.stream(prompt);

  const encoder = new TextEncoder();

  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = typeof chunk.content === "string" ? chunk.content : "";

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
