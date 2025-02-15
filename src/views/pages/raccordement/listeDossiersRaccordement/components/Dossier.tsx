import React, { FC } from 'react';

import { DossierRaccordementReadModel } from '@potentiel/domain-views';
import { userIs } from '../../../../../modules/users';
import { UtilisateurReadModel } from '../../../../../modules/utilisateur/récupérer/UtilisateurReadModel';

import { Separateur } from './Separateur';
import { ÉtapeDemandeComplèteRaccordement } from './ÉtapeDemandeComplèteRaccordement';
import { ÉtapePropositionTechniqueEtFinancière } from './ÉtapePropositionTechniqueEtFinancière';
import { ÉtapeMiseEnService } from './ÉtapeMiseEnService';
import { RawIdentifiantProjet } from '@potentiel/domain-usecases';

export const Dossier: FC<{
  user: UtilisateurReadModel;
  identifiantProjet: RawIdentifiantProjet;
  dossier: DossierRaccordementReadModel;
}> = ({
  user,
  identifiantProjet,
  dossier: {
    référence,
    demandeComplèteRaccordement: {
      dateQualification,

      accuséRéception,
    },
    propositionTechniqueEtFinancière,
    miseEnService,
  },
}) => (
  <div className="flex flex-col md:flex-row justify-items-stretch">
    <ÉtapeDemandeComplèteRaccordement
      identifiantProjet={identifiantProjet}
      dateQualification={dateQualification}
      référence={référence}
      hasDCRFile={!!accuséRéception?.format}
      showEditLink={userIs(['porteur-projet', 'admin', 'dgec-validateur'])(user)}
    />

    <Separateur />

    <ÉtapePropositionTechniqueEtFinancière
      identifiantProjet={identifiantProjet}
      référence={référence}
      propositionTechniqueEtFinancière={propositionTechniqueEtFinancière}
      hasPTFFile={!!propositionTechniqueEtFinancière?.propositionTechniqueEtFinancièreSignée.format}
      showEditLink={userIs(['porteur-projet', 'admin', 'dgec-validateur'])(user)}
    />

    <Separateur />

    <ÉtapeMiseEnService
      identifiantProjet={identifiantProjet}
      référence={référence}
      dateMiseEnService={miseEnService?.dateMiseEnService}
      showEditLink={userIs(['admin', 'dgec-validateur'])(user)}
    />
  </div>
);
