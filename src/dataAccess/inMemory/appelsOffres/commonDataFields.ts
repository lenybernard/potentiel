import { ValuesType } from 'utility-types'
import { AppelOffre } from '../../../entities'
import { asLiteral } from '../../../helpers/asLiteral'

const toTypeLiteral = (str) =>
  asLiteral<ValuesType<AppelOffre['dataFields']>['type']>(str)

const commonDataFields = [
  { field: 'numeroCRE', type: toTypeLiteral('string'), column: 'N°CRE' },
  {
    field: 'familleId',
    type: toTypeLiteral('string'),
    column: 'Famille de candidature',
  },
  {
    field: 'nomCandidat',
    type: toTypeLiteral('string'),
    column: 'Nom (personne physique) ou raison sociale (personne morale) :',
  },
  { field: 'nomProjet', type: toTypeLiteral('string'), column: 'Nom projet' },
  {
    field: 'puissance',
    type: toTypeLiteral('number'),
    column:
      'Puissance installé du projet indiquée au B. du formulaire de candidature (MWc)',
  },
  {
    field: 'prixReference',
    type: toTypeLiteral('number'),
    column:
      'Prix de référence unitaire (T0) proposé au C. du formulaire de candidature (€/MWh)',
  },
  {
    field: 'evaluationCarbone',
    type: toTypeLiteral('number'),
    column:
      'Evaluation carbone simplifiée indiquée au C. du formulaire de candidature et arrondie (kg eq CO2/kWc)',
  },
  { field: 'note', type: toTypeLiteral('number'), column: 'Note totale' },
  {
    field: 'nomRepresentantLegal',
    type: toTypeLiteral('string'),
    column: 'Nom et prénom du représentant légal',
  },
  {
    field: 'email',
    type: toTypeLiteral('string'),
    column: 'Adresse électronique du contact',
  },
  {
    field: 'adresseProjet',
    type: toTypeLiteral('string'),
    column: 'N°, voie, lieu-dit',
  },
  { field: 'codePostalProjet', type: toTypeLiteral('string'), column: 'CP' },
  { field: 'communeProjet', type: toTypeLiteral('string'), column: 'Commune' },
  {
    field: 'departementProjet',
    type: toTypeLiteral('string'),
    column: 'Département',
  },
  { field: 'regionProjet', type: toTypeLiteral('string'), column: 'Région' },
  { field: 'classe', type: toTypeLiteral('string'), column: 'Classé ?' },
  {
    field: 'motifsElimination',
    type: toTypeLiteral('string'),
    column: "Motif d'élimination",
  },
  {
    field: 'fournisseur',
    type: toTypeLiteral('string'),
    column: 'Nom du fabricant \n(Modules ou films)',
  },
  {
    field: 'isInvestissementParticipatif',
    type: toTypeLiteral('stringEquals'),
    column: 'Investissement ou financement participatif ?',
    value: 'Investissement participatif (T1)',
  },
  { field: 'notifiedOn', type: toTypeLiteral('date'), column: 'Notification' },
]

export { commonDataFields }
