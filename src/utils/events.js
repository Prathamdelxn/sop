



// Event names
export const EVENTS = {
  BASKET_UPDATED: 'BASKET_UPDATED',
  BATCH_UPDATED: 'BATCH_UPDATED',
};

/**
 * Trigger a refresh event for a specific line
 */
export const triggerLineRefresh = async (lineId, type = EVENTS.BASKET_UPDATED) => {
  if (!lineId) return;
  
  const lineIdStr = lineId._id ? lineId._id.toString() : lineId.toString();
  const data = { lineId: lineIdStr, type, timestamp: Date.now() };
  
  console.log(`[EVENTS] Emitting refresh for line: ${lineIdStr}, type: ${type}`);
  
  try {
    const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
    if (wsUrl) {
      await fetch(`${wsUrl}/api/trigger`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channel: `line-${lineIdStr}`,
          event: 'refresh',
          data: data,
        }),
      });
      console.log(`[WS] Triggered refresh event for line-${lineIdStr}`);
    } else {
      console.warn('[WS] NEXT_PUBLIC_WEBSOCKET_URL not set, cannot trigger event');
    }
  } catch (err) {
    console.error('WS trigger error:', err);
  }
};
