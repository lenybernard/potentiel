import { BaseDomainEvent, DomainEvent } from '../../../core/domain';
import { CahierDesChargesRéférence } from '@potentiel-domain/appel-offre';

export type ModificationRequestedPayload = {
  modificationRequestId: string;
  projectId: string;
  requestedBy: string;
  authority: 'dgec' | 'dreal';
  fileId?: string;
  justification?: string;
  cahierDesCharges?: CahierDesChargesRéférence;
} & (
  | {
      type: 'puissance';
      puissance: number;
      puissanceAuMomentDuDepot?: number; // added later, so not always present
    }
  | { type: 'actionnaire'; actionnaire: string }
  | { type: 'producteur'; producteur: string }
  | { type: 'fournisseur'; fournisseur: string; evaluationCarbone: number }
  | { type: 'delai'; delayInMonths: number }
  | { type: 'abandon' }
  | { type: 'recours' }
);
export class ModificationRequested
  extends BaseDomainEvent<ModificationRequestedPayload>
  implements DomainEvent
{
  public static type: 'ModificationRequested' = 'ModificationRequested';
  public type = ModificationRequested.type;
  currentVersion = 1;

  aggregateIdFromPayload(payload: ModificationRequestedPayload) {
    return payload.modificationRequestId;
  }
}
