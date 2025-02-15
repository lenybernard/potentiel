import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { Message, MessageHandler, mediator } from 'mediateur';
import {
  createGestionnaireRéseauAggregateId,
  loadGestionnaireRéseauAggregateFactory,
} from '../gestionnaireRéseau.aggregate';
import { IdentifiantGestionnaireRéseauValueType } from '../gestionnaireRéseau.valueType';
import { GestionnaireRéseauInconnuError } from '../gestionnaireRéseau.error';
import { GestionnaireRéseauModifiéEventV1 } from '../gestionnaireRéseau.event';

export type ModifierGestionnaireRéseauCommand = Message<
  'MODIFIER_GESTIONNAIRE_RÉSEAU',
  {
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseauValueType;
    raisonSociale: string;
    aideSaisieRéférenceDossierRaccordement: {
      format: string;
      légende: string;
      expressionReguliere: string;
    };
  }
>;

export type ModifierGestionnaireRéseauDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
};

export const registerModifierGestionnaireRéseauCommand = ({
  publish,
  loadAggregate,
}: ModifierGestionnaireRéseauDependencies) => {
  const loadGestionnaireRéseauAggregate = loadGestionnaireRéseauAggregateFactory({
    loadAggregate,
  });

  const commandHandler: MessageHandler<ModifierGestionnaireRéseauCommand> = async ({
    identifiantGestionnaireRéseau,
    raisonSociale,
    aideSaisieRéférenceDossierRaccordement,
  }) => {
    const gestionnaireRéseau = await loadGestionnaireRéseauAggregate(identifiantGestionnaireRéseau);

    if (isNone(gestionnaireRéseau)) {
      throw new GestionnaireRéseauInconnuError();
    }

    const event: GestionnaireRéseauModifiéEventV1 = {
      type: 'GestionnaireRéseauModifié-V1',
      payload: {
        codeEIC: identifiantGestionnaireRéseau.formatter(),
        raisonSociale,
        aideSaisieRéférenceDossierRaccordement,
      },
    };
    await publish(createGestionnaireRéseauAggregateId(identifiantGestionnaireRéseau), event);
  };

  mediator.register('MODIFIER_GESTIONNAIRE_RÉSEAU', commandHandler);
};
