import { setupDomain } from '@potentiel/domain';
import { loadAggregate, publish, subscribe } from '@potentiel/pg-event-sourcing';
import {
  createProjection,
  findProjection,
  listProjection,
  removeProjection,
  searchProjection,
  updateProjection,
} from '@potentiel/pg-projections';
import {
  consumerSubscribe,
  téléverserFichierDossierRaccordementAdapter,
  téléchargerFichierDossierRaccordementAdapter,
} from '@potentiel/infra-adapters';
import { setupDomainViews, LegacyProjectRepository } from '@potentiel/domain-views';
import { publishToEventBus } from '@potentiel/redis-event-bus-client';
import { consumerPool } from '@potentiel/redis-event-bus-consumer';
import { Message, mediator } from 'mediateur';
import { getLogger } from '@potentiel/monitoring';
import { randomUUID } from 'crypto';

export type UnsetupApp = () => Promise<void>;

export const bootstrap = async (legacy: {
  projectRepository: LegacyProjectRepository;
}): Promise<UnsetupApp> => {
  mediator.use<Message>({
    middlewares: [
      async (message, next) => {
        const correlationId = randomUUID();
        getLogger().info('Executing message', { message: JSON.stringify(message), correlationId });
        const result = await next();
        getLogger().info('Message executed', { result: JSON.stringify(result), correlationId });
        return result;
      },
    ],
  });

  const unsetupDomain = await setupDomain({
    common: {
      loadAggregate,
      publish,
      subscribe: consumerSubscribe,
    },
    raccordement: {
      enregistrerAccuséRéceptionDemandeComplèteRaccordement:
        téléverserFichierDossierRaccordementAdapter,
      enregistrerPropositionTechniqueEtFinancièreSignée:
        téléverserFichierDossierRaccordementAdapter,
    },
  });

  const unsetupDomainViews = await setupDomainViews({
    common: {
      create: createProjection,
      find: findProjection,
      list: listProjection,
      remove: removeProjection,
      search: searchProjection,
      subscribe: consumerSubscribe,
      update: updateProjection,
      legacy,
    },
    raccordement: {
      récupérerAccuséRéceptionDemandeComplèteRaccordement:
        téléchargerFichierDossierRaccordementAdapter,
      récupérerPropositionTechniqueEtFinancièreSignée: téléchargerFichierDossierRaccordementAdapter,
    },
  });

  const unsubscribePublishAll = await subscribe('all', async (event) => {
    await publishToEventBus(event.type, event);
  });

  return async () => {
    await unsetupDomain();
    await unsetupDomainViews();
    await unsubscribePublishAll();
    consumerPool.kill();
  };
};
