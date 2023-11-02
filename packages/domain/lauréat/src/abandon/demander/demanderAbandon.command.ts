import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet, IdentifiantUtilisateur } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { loadAbandonFactory } from '../abandon.aggregate';
import { LoadAggregate } from '@potentiel-domain/core';

export type DemanderAbandonCommand = Message<
  'DEMANDER_ABANDON_COMMAND',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    raison: string;
    pièceJustificative?: DocumentProjet.ValueType;
    recandidature: boolean;
    utilisateur: IdentifiantUtilisateur.ValueType;
    dateDemande: DateTime.ValueType;
  }
>;

export const registerDemanderAbandonCommand = (loadAggregate: LoadAggregate) => {
  const loadAbandon = loadAbandonFactory(loadAggregate);
  const handler: MessageHandler<DemanderAbandonCommand> = async ({
    identifiantProjet,
    pièceJustificative,
    raison,
    recandidature,
    utilisateur,
    dateDemande,
  }) => {
    const abandon = await loadAbandon(identifiantProjet, false);

    await abandon.demander({
      identifiantProjet,
      pièceJustificative,
      raison,
      utilisateur,
      dateDemande,
      recandidature,
    });
  };
  mediator.register('DEMANDER_ABANDON_COMMAND', handler);
};
