import { OperationRejectedError, ReadonlyValueType } from '@potentiel-domain/core';

export type RawType =
  | 'admin'
  | 'porteur-projet'
  | 'dreal'
  | 'acheteur-obligé'
  | 'ademe'
  | 'dgec-validateur'
  | 'caisse-des-dépôts'
  | 'cre';

const roles: Array<RawType> = [
  'admin',
  'porteur-projet',
  'dreal',
  'acheteur-obligé',
  'ademe',
  'dgec-validateur',
  'caisse-des-dépôts',
  'cre',
];

export type ValueType = ReadonlyValueType<{
  nom: RawType;
  libellé(): string;
  vérifierLaPermission(value: string): void;
}>;

export const convertirEnValueType = (value: string): ValueType => {
  estValide(value);
  return {
    nom: value,
    estÉgaleÀ(valueType) {
      return valueType.nom === this.nom;
    },
    libellé() {
      return this.nom.replace('-', ' ').toLocaleUpperCase();
    },
    vérifierLaPermission(permission) {
      const àLaPermission = permissions[this.nom].includes(permission);

      if (!àLaPermission) {
        throw new AccésFonctionnalitéRefuséError(this.nom, permission);
      }
    },
  };
};

export const estUnRoleValide = (value: string) => {
  return (roles as Array<string>).includes(value);
};

function estValide(value: string): asserts value is RawType {
  const isValid = estUnRoleValide(value);

  if (!isValid) {
    throw new RoleRefuséError(value);
  }
}

export const porteur = convertirEnValueType('porteur-projet');

class RoleRefuséError extends OperationRejectedError {
  constructor(value: string) {
    super(`Le role ne correspond à aucune valeur connue`, {
      value,
    });
  }
}

class AccésFonctionnalitéRefuséError extends OperationRejectedError {
  constructor(fonctionnalité: string, role: string) {
    super('Accés à la fonctionnalité refusé', {
      fonctionnalité,
      role,
    });
  }
}

// MATRICE en mémoire en attendant de pouvoir gérer les permissions depuis une interface d'administration
const permissions: Record<RawType, string[]> = {
  admin: [
    //QUERY
    'CONSULTER_ABANDON_QUERY',
    'LISTER_ABANDONS_QUERY',
    //USECASE
    'ACCORDER_ABANDON_USECASE',
    'ANNULER_REJET_ABANDON_USECASE',
    'DEMANDER_CONFIRMATION_ABANDON_USECASE',
    'REJETER_ABANDON_USECASE',
  ],
  'acheteur-obligé': [],
  ademe: [],
  'caisse-des-dépôts': [],
  cre: [],
  dreal: [],
  'dgec-validateur': [
    //QUERY
    'CONSULTER_ABANDON_QUERY',
    'LISTER_ABANDONS_QUERY',
    //USECASE
    'ACCORDER_ABANDON_USECASE',
    'ANNULER_REJET_ABANDON_USECASE',
    'DEMANDER_CONFIRMATION_ABANDON_USECASE',
    'REJETER_ABANDON_USECASE',
  ],
  'porteur-projet': [
    'CONSULTER_ABANDON_QUERY',
    'ANNULER_ABANDON_USECASE',
    'CONFIRMER_ABANDON_USECASE',
    'DEMANDER_ABANDON_USECASE',
  ],
};
