import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { Publish, LoadAggregate } from '@potentiel/core-domain';
import {
  createRaccordementAggregateId,
  loadRaccordementAggregateFactory,
} from '../../raccordement.aggregate';
import { DossierRaccordementNonRéférencéError } from '../../raccordement.errors';
import { isNone } from '@potentiel/monads';
import { AccuséRéceptionDemandeComplèteRaccordementSuppriméEvent } from './accuséRéceptionDemandeComplèteRaccordementSupprimé.event';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../../projet/identifiantProjet';

export type SupprimerAccuséRéceptionDemandeComplèteRaccordementCommand = Message<
  'SUPPRIMER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND',
  {
    identifiantProjet: IdentifiantProjet;
    référenceDossierRaccordement: string;
    accuséRéception: { format: string };
  }
>;

export type SupprimerAccuséRéceptionDemandeComplèteRaccordementDependencies = {
  loadAggregate: LoadAggregate;
  publish: Publish;
};

export const registerSupprimerAccuséRéceptionDemandeComplèteRaccordementCommand = ({
  loadAggregate,
  publish,
}: SupprimerAccuséRéceptionDemandeComplèteRaccordementDependencies) => {
  const loadRaccordementAggregate = loadRaccordementAggregateFactory({
    loadAggregate,
  });

  const handler: MessageHandler<
    SupprimerAccuséRéceptionDemandeComplèteRaccordementCommand
  > = async ({ identifiantProjet, référenceDossierRaccordement, accuséRéception: { format } }) => {
    const raccordement = await loadRaccordementAggregate(identifiantProjet);

    if (isNone(raccordement) || !raccordement.références.includes(référenceDossierRaccordement)) {
      throw new DossierRaccordementNonRéférencéError();
    }

    const accuséRéceptionSupprimeEvent: AccuséRéceptionDemandeComplèteRaccordementSuppriméEvent = {
      type: 'AccuséRéceptionDemandeComplèteRaccordementSupprimé',
      payload: {
        identifiantProjet: formatIdentifiantProjet(identifiantProjet),
        référenceDossierRaccordement,
        format,
      },
    };

    await publish(createRaccordementAggregateId(identifiantProjet), accuséRéceptionSupprimeEvent);
  };

  mediator.register('SUPPRIMER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND', handler);
};

export const buildSupprimerAccuséRéceptionDemandeComplèteRaccordementCommand =
  getMessageBuilder<SupprimerAccuséRéceptionDemandeComplèteRaccordementCommand>(
    'SUPPRIMER_ACCUSÉ_RÉCEPTION_DEMANDE_COMPLÈTE_RACCORDEMENT_COMMAND',
  );
