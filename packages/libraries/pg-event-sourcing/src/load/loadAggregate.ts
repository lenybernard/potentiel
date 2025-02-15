import { AggregateId, AggregateFactory, DomainEvent, LoadAggregate } from '@potentiel/core-domain';
import { none } from '@potentiel/monads';
import { loadFromStream } from './loadFromStream';

/**
 * @deprecated un nouveau systéme de permission va être implémenter dans la nouvelle stack technique
 */
export const loadAggregate: LoadAggregate = async <
  TAggregate extends Record<string, unknown>,
  TDomainEvent extends DomainEvent,
>(
  aggregateId: AggregateId,
  aggregateFactory: AggregateFactory<TAggregate, TDomainEvent>,
) => {
  const events = await loadFromStream({
    streamId: aggregateId,
  });

  if (!events.length) {
    return none;
  }

  const version = events[events.length - 1].version;
  const domainEvents = events.map<TDomainEvent>(
    ({ type, payload }) => ({ type, payload } as TDomainEvent),
  );

  return {
    ...aggregateFactory(domainEvents, loadAggregate),
    aggregateId,
    version,
  };
};
