import { Publish } from '@potentiel/core-domain';
import { executeQuery } from '@potentiel/pg-helpers';

/**
 * @deprecated en faveur du package @potentiel-infrastructure/pg-event-sourcing
 */
const insertEvent =
  'insert into event_store.event_stream values ($1, $2, $3, (select count(stream_id) + 1 from event_store.event_stream WHERE stream_id = $5), $4)';

/**
 * @deprecated en faveur du package @potentiel-infrastructure/pg-event-sourcing
 */
export const publish: Publish = async (streamId, ...events) => {
  for (const { type, payload } of events) {
    const createdAt = new Date().toISOString();
    await executeQuery(insertEvent, streamId, createdAt, type, payload, streamId);
  }
};
