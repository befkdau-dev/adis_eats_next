export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { id } = await params;

  const encoder = new TextEncoder();
  let heartbeat;

  const stream = new ReadableStream({
    start(controller) {
      const send = (event, data) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
        );
      };

      send("connected", {
        orderId: String(id),
        message: "Tracking stream connected",
      });

      // SSE comment: keeps intermediaries from treating the stream as idle.
      heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": keep-alive\n\n"));
        } catch {
          clearInterval(heartbeat);
        }
      }, 15000);

      request.signal.addEventListener(
        "abort",
        () => {
          clearInterval(heartbeat);
          try {
            controller.close();
          } catch {
            // The stream may already be closed.
          }
        },
        { once: true },
      );
    },

    cancel() {
      clearInterval(heartbeat);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
