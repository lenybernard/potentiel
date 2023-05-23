import { Message, MessageHandler, getMessageBuilder, mediator } from 'mediateur';
import {
  EnregistrerPropositionTechniqueEtFinancièreSignéeCommand,
  buildEnregistrerPropositionTechniqueEtFinancièreSignéeCommand,
} from './enregistrerPropositionTechniqueEtFinancièreSignée/enregistrerPropositionTechniqueEtFinancièreSignée.command';
import { buildSupprimerPropositionTechniqueEtFinancièreSignéeCommand } from './supprimerPropositionTechniqueEtFinancièreSignée/supprimerPropositionTechniqueEtFinancièreSignée.command';
import { buildConsulterDossierRaccordementQuery } from '../dossierRaccordement/consulter/consulterDossierRaccordement.query';
import {
  ModifierPropositionTechniqueEtFinancièreCommand,
  buildModifierPropositionTechniqueEtFinancièreCommand,
} from './modifier/modifierPropositiontechniqueEtFinancière.command';

export type ModifierPropositiontechniqueEtFinancièreUseCase = Message<
  'MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE',
  ModifierPropositionTechniqueEtFinancièreCommand['data'] &
    EnregistrerPropositionTechniqueEtFinancièreSignéeCommand['data']
>;

export const registerModifierPropositiontechniqueEtFinancièreUseCase = () => {
  const runner: MessageHandler<ModifierPropositiontechniqueEtFinancièreUseCase> = async ({
    identifiantProjet,
    dateSignature,
    référenceDossierRaccordement,
    propositionTechniqueEtFinancière,
  }) => {
    const dossierRaccordement = await mediator.send(
      buildConsulterDossierRaccordementQuery({
        identifiantProjet,
        référence: référenceDossierRaccordement,
      }),
    );

    await mediator.send(
      buildSupprimerPropositionTechniqueEtFinancièreSignéeCommand({
        identifiantProjet,
        référenceDossierRaccordement,
        propositionTechniqueEtFinancière: {
          format: dossierRaccordement.propositionTechniqueEtFinancière?.format || '',
        },
      }),
    );

    await mediator.send(
      buildModifierPropositionTechniqueEtFinancièreCommand({
        identifiantProjet,
        dateSignature,
        référenceDossierRaccordement,
      }),
    );

    await mediator.send(
      buildEnregistrerPropositionTechniqueEtFinancièreSignéeCommand({
        identifiantProjet,
        propositionTechniqueEtFinancière,
        référenceDossierRaccordement,
      }),
    );
  };

  mediator.register('MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE', runner);
};

export const buildModifierPropositiontechniqueEtFinancièreUseCase =
  getMessageBuilder<ModifierPropositiontechniqueEtFinancièreUseCase>(
    'MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE',
  );
