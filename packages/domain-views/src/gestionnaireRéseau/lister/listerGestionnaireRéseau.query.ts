import { List, ListResult } from '@potentiel/core-domain-views';
import { GestionnaireRéseauReadModel } from '../gestionnaireRéseau.readModel';
import { Message, MessageHandler, mediator } from 'mediateur';

export type ListerGestionnaireRéseauQuery = Message<
  'LISTER_GESTIONNAIRE_RÉSEAU_QUERY',
  {},
  ListResult<GestionnaireRéseauReadModel>
>;

export type ListerGestionnaireRéseauDependencies = {
  list: List;
};

export const registerListerGestionnaireRéseauQuery = ({
  list,
}: ListerGestionnaireRéseauDependencies) => {
  const commandHandler: MessageHandler<ListerGestionnaireRéseauQuery> = async () =>
    list<GestionnaireRéseauReadModel>({
      type: 'gestionnaire-réseau',
      orderBy: { property: 'raisonSociale', ascending: true },
    });
  mediator.register('LISTER_GESTIONNAIRE_RÉSEAU_QUERY', commandHandler);
};
