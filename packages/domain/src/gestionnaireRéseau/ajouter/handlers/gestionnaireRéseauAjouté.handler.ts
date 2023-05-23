import { Create, DomainEventHandlerFactory } from '@potentiel/core-domain';
import { GestionnaireRéseauReadModel } from '../../gestionnaireRéseau.readModel';
import { GestionnaireRéseauAjoutéEvent } from '../gestionnaireRéseauAjouté.event';

export type GestionnaireRéseauAjoutéHandlerDependencies = {
  create: Create;
};

/**
 * @deprecated
 */
export const gestionnaireRéseauAjoutéHandlerFactory: DomainEventHandlerFactory<
  GestionnaireRéseauAjoutéEvent,
  GestionnaireRéseauAjoutéHandlerDependencies
> =
  ({ create }) =>
  async (event) => {
    await create<GestionnaireRéseauReadModel>(`gestionnaire-réseau#${event.payload.codeEIC}`, {
      ...event.payload,
    });
  };
