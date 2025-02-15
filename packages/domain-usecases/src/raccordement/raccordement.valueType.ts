import { Option } from '@potentiel/monads';

export type RawRéférenceDossierRaccordement = string;

export type RéférenceDossierRaccordement = {
  référence: string;
};

export type RéférenceDossierRaccordementValueType = RéférenceDossierRaccordement & {
  estÉgaleÀ(référenceDossierRaccordement: RéférenceDossierRaccordement): boolean;
  formatter(): RawRéférenceDossierRaccordement;
};

// TODO: valider la valeur avant de la convertir en ValueType
export const convertirEnRéférenceDossierRaccordement = (
  référenceDossierRaccordement:
    | string
    | Omit<RéférenceDossierRaccordementValueType, 'formatter' | 'estÉgaleÀ'>,
): RéférenceDossierRaccordementValueType => {
  return {
    référence: estUneRéférenceDossierRaccordement(référenceDossierRaccordement)
      ? référenceDossierRaccordement.référence
      : référenceDossierRaccordement,
    estÉgaleÀ({ référence }: RéférenceDossierRaccordement) {
      return this.référence === référence;
    },
    formatter() {
      return this.référence;
    },
  };
};

export const estUneRéférenceDossierRaccordement = (
  value: any,
): value is RéférenceDossierRaccordement => {
  return typeof value.référence === 'string';
};

export type DossierRaccordement = {
  référence: RéférenceDossierRaccordementValueType;
  demandeComplèteRaccordement: {
    dateQualification: Option<Date>;
    format: Option<string>;
  };
  miseEnService: {
    dateMiseEnService: Option<Date>;
  };
  propositionTechniqueEtFinancière: {
    dateSignature: Option<Date>;
    format: Option<string>;
  };
};

export type AccuséRéceptionDemandeComplèteRaccordement = {
  format: string;
  content: ReadableStream;
};

export type PropositionTechniqueEtFinancièreSignée = {
  format: string;
  content: ReadableStream;
};
