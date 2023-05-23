import { DomainEventHandlerFactory } from '@potentiel/core-domain';
import { PropositionTechniqueEtFinancièreSignéeSuppriméeEvent } from '../propositionTechniqueEtFinancièreSignéeSupprimée.event';

export type SupprimerPropositionTechniqueEtFinancièreSignéePort = (args: {
  identifiantProjet: string;
  référenceDossierRaccordement: string;
  format: string;
}) => Promise<void>;

export type PropositionTechniqueEtFinancièreSignéeSuppriméeDependencies = {
  supprimerPropositionTechniqueEtFinancièreSignée: SupprimerPropositionTechniqueEtFinancièreSignéePort;
};

/**
 * @deprecated
 */
export const propositionTechniqueEtFinancièreSignéeSuppriméeHandlerFactory: DomainEventHandlerFactory<
  PropositionTechniqueEtFinancièreSignéeSuppriméeEvent,
  PropositionTechniqueEtFinancièreSignéeSuppriméeDependencies
> =
  ({ supprimerPropositionTechniqueEtFinancièreSignée }) =>
  async ({ payload: { format, référenceDossierRaccordement, identifiantProjet } }) => {
    await supprimerPropositionTechniqueEtFinancièreSignée({
      identifiantProjet,
      référenceDossierRaccordement,
      format,
    });
  };
