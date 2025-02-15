import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { loadTâcheAggregateFactory } from '../tâche.aggregate';
import * as Tâche from '../typeTâche.valueType';

export type AcheverTâcheCommand = Message<
  'ACHEVER_TÂCHE_COMMAND',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    typeTâche: Tâche.ValueType;
  }
>;

export const registerAcheverTâcheCommand = (loadAggregate: LoadAggregate) => {
  const loadTâche = loadTâcheAggregateFactory(loadAggregate);
  const handler: MessageHandler<AcheverTâcheCommand> = async ({ identifiantProjet, typeTâche }) => {
    const tâche = await loadTâche(typeTâche, identifiantProjet);
    await tâche.achever({
      identifiantProjet,
    });
  };
  mediator.register('ACHEVER_TÂCHE_COMMAND', handler);
};
