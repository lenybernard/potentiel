'use client';

import { TransmettrePreuveRecandidatureForm } from './transmettre/TransmettrePreuveRecandidatureForm';
import { ProjetPageTemplate } from '@/components/templates/ProjetPageTemplate';
import { FC } from 'react';

export type TransmettrePreuveRecandidaturePageProps = {
  projet: Parameters<typeof ProjetPageTemplate>[0]['projet'];
  projetsÀSélectionner: Parameters<
    typeof TransmettrePreuveRecandidatureForm
  >[0]['projetsÀSélectionner'];
  utilisateur: Parameters<typeof TransmettrePreuveRecandidatureForm>[0]['utilisateur'];
};

export const TransmettrePreuveRecandidaturePage: FC<TransmettrePreuveRecandidaturePageProps> = ({
  projet,
  projetsÀSélectionner,
  utilisateur,
}) => {
  return (
    <ProjetPageTemplate
      projet={projet}
      heading={
        <div className="flex flex-row gap-3 items-center">
          <span>Transmettre preuve de recandidature</span>
        </div>
      }
    >
      {projetsÀSélectionner.length > 0 ? (
        <TransmettrePreuveRecandidatureForm
          identifiantProjet={projet.identifiantProjet}
          projetsÀSélectionner={projetsÀSélectionner}
          utilisateur={utilisateur}
        />
      ) : (
        <p>Vous ne disposez d'aucun projet éligible avec une preuve de recandidature</p>
      )}
    </ProjetPageTemplate>
  );
};
