import { EventEmitter } from 'events';

// Singleton to ensure we only have one emitter across the app
let eventEmitter;

if (process.env.NODE_ENV === 'production') {
  eventEmitter = new EventEmitter();
} else {
  // In development, the module is reloaded, so we attach it to the global object
  if (!global.elogbookEvents) {
    global.elogbookEvents = new EventEmitter();
  }
  eventEmitter = global.elogbookEvents;
}

export const elogbookEvents = eventEmitter;

// Event names
export const EVENTS = {
  BASKET_UPDATED: 'BASKET_UPDATED',
  BATCH_UPDATED: 'BATCH_UPDATED',
};

/**
 * Trigger a refresh event for a specific line
 */
export const triggerLineRefresh = (lineId, type = EVENTS.BASKET_UPDATED) => {
  if (!lineId) return;
  elogbookEvents.emit('refresh', { lineId: lineId.toString(), type });
};
