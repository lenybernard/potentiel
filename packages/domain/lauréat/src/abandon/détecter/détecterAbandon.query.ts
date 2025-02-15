import { Message, MessageHandler, mediator } from 'mediateur';

import { isSome } from '@potentiel/monads';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { AbandonProjection } from '../abandon.projection';
import { Find } from '@potentiel-libraries/projection';

export type DétecterAbandonQuery = Message<
  'DÉTECTER_ABANDON_QUERY',
  {
    identifiantProjetValue: string;
  },
  boolean
>;

export type DétecterAbandonDependencies = {
  find: Find;
};

export const registerDétecterAbandonQuery = ({ find }: DétecterAbandonDependencies) => {
  const handler: MessageHandler<DétecterAbandonQuery> = async ({ identifiantProjetValue }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const result = await find<AbandonProjection>(`abandon|${identifiantProjet.formatter()}`);

    return isSome(result);
  };
  mediator.register('DÉTECTER_ABANDON_QUERY', handler);
};
