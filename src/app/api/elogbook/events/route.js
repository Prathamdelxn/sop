import { elogbookEvents } from "@/utils/events";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const lineId = searchParams.get("lineId");

  if (!lineId) {
    return new Response("lineId required", { status: 400 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const onRefresh = (data) => {
        // Only send if it matches the lineId we are interested in
        if (data.lineId === lineId) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        }
      };

      elogbookEvents.on("refresh", onRefresh);

      // Heartbeat to keep connection alive
      const heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(": heartbeat\n\n"));
      }, 30000);

      // Clean up when connection closes
      req.signal.addEventListener("abort", () => {
        elogbookEvents.off("refresh", onRefresh);
        clearInterval(heartbeat);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
