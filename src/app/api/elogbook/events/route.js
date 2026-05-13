import { elogbookEvents } from "@/utils/events";
import fs from 'fs';
import path from 'path';

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
        console.log(`[SSE] Received refresh event in route:`, data, `Listening for lineId:`, lineId);
        // Only send if it matches the lineId we are interested in
        if (data.lineId === lineId) {
          console.log(`[SSE] Sending data to client for line: ${lineId}`);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        }
      };

      elogbookEvents.on("refresh", onRefresh);

      // File watcher for dev (cross-process)
      let watcher;
      if (process.env.NODE_ENV !== 'production') {
        const EVENT_FILE = path.join(process.cwd(), '.events_cache', 'event.json');
        const dir = path.dirname(EVENT_FILE);
        
        if (!fs.existsSync(dir)) {
          try {
            fs.mkdirSync(dir, { recursive: true });
          } catch (err) {
            // Ignore
          }
        }
        
        watcher = fs.watch(dir, (eventType, filename) => {
          if (filename === path.basename(EVENT_FILE)) {
            try {
              const content = fs.readFileSync(EVENT_FILE, 'utf-8');
              const data = JSON.parse(content);
              console.log(`[SSE] File watcher received event:`, data);
              if (data.lineId === lineId) {
                console.log(`[SSE] Sending data to client from file watcher for line: ${lineId}`);
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
              }
            } catch (err) {
              // Ignore read errors
            }
          }
        });
      }

      // Heartbeat to keep connection alive
      const heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(": heartbeat\n\n"));
      }, 30000);

      // Clean up when connection closes
      req.signal.addEventListener("abort", () => {
        elogbookEvents.off("refresh", onRefresh);
        if (watcher) watcher.close();
        clearInterval(heartbeat);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
