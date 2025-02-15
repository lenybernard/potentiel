import { ReadModel } from '@potentiel/core-domain-views';
import { RawIdentifiantProjet, RawRéférenceDossierRaccordement } from '@potentiel/domain-usecases';

export type DossierRaccordementReadModelKey =
  `dossier-raccordement|${RawIdentifiantProjet}#${RawRéférenceDossierRaccordement}`;

export type LegacyDossierRaccordementReadModel = ReadModel<
  'dossier-raccordement',
  {
    référence: string;
    dateQualification?: string;
    propositionTechniqueEtFinancière?: {
      dateSignature: string;
      format: string;
    };
    dateMiseEnService?: string;
    accuséRéception?: { format: string };
  }
>;

export type DossierRaccordementReadModel = ReadModel<
  'dossier-raccordement',
  {
    référence: string;
    demandeComplèteRaccordement: {
      dateQualification?: string;
      accuséRéception?: { format: string };
    };
    propositionTechniqueEtFinancière?: {
      dateSignature: string;
      propositionTechniqueEtFinancièreSignée: { format: string };
    };
    miseEnService?: {
      dateMiseEnService: string;
    };
  }
>;

export type ListeDossiersRaccordementReadModel = ReadModel<
  'liste-dossiers-raccordement',
  {
    références: Array<string>;
  }
>;

export type RésultatRechercheDossierRaccordementReadModel = ReadModel<
  'résultat-recherche-dossier-raccordement',
  {
    identifiantProjet: RawIdentifiantProjet;
    référenceDossierRaccordement: RawRéférenceDossierRaccordement;
  }
>;

export type PropositionTechniqueEtFinancièreSignéeReadModel = ReadModel<
  'proposition-technique-et-financière-signée',
  { format: string; content: ReadableStream }
>;

export type AccuséRéceptionDemandeComplèteRaccordementReadModel = ReadModel<
  'accusé-réception-demande-compléte-raccordement',
  { format: string; content: ReadableStream }
>;
