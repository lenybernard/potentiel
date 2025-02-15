import React, { useState } from 'react';
import { AlertBox, Form, PrimaryButton, SecondaryLinkButton } from '../../..';
import { ProjectDataForChoisirCDCPage } from '../../../../../modules/project';
import routes from '../../../../../routes';
import { formatCahierDesChargesRéférence } from '../../../../../entities/cahierDesCharges';

import { CahierDesChargesInitial } from './CahierDesChargesInitial';
import { CahierDesChargesModifiéDisponible } from './CahierDesChargesModifiéDisponible';
import { CahierDesChargesSelectionnable } from './CahierDesChargesSélectionnable';

type ChoisirCahierDesChargesFormulaireProps = {
  infoBox: React.ReactNode;
  projet: ProjectDataForChoisirCDCPage;
  redirectUrl?: string;
  type?: 'actionnaire' | 'fournisseur' | 'producteur' | 'puissance' | 'recours' | 'delai';
};

export const ChoisirCahierDesChargesFormulaire: React.FC<
  ChoisirCahierDesChargesFormulaireProps
> = ({ projet, redirectUrl, type, infoBox }) => {
  const { id: projetId, appelOffre, cahierDesChargesActuel } = projet;
  const [cdcChoisi, choisirCdc] = useState(cahierDesChargesActuel);
  const [peutEnregistrerLeChangement, pouvoirEnregistrerLeChangement] = useState(false);
  const cahiersDesChargesModifiésDisponibles =
    appelOffre.periode.cahiersDesChargesModifiésDisponibles;

  return (
    <Form action={routes.CHANGER_CDC} method="post" className="mx-auto">
      {infoBox}
      <input
        type="hidden"
        name="redirectUrl"
        value={redirectUrl || routes.PROJECT_DETAILS(projetId)}
      />
      <input type="hidden" name="projectId" value={projetId} />
      {type && <input type="hidden" name="type" value={type} />}
      <ul className="list-none pl-0 m-0 flex flex-col gap-4">
        <li key="cahier-des-charges-initial">
          <CahierDesChargesSelectionnable
            {...{
              id: 'initial',
              onCahierDesChargesChoisi: (id) => {
                choisirCdc(id);
                pouvoirEnregistrerLeChangement(id !== cahierDesChargesActuel);
              },
              sélectionné: cdcChoisi === 'initial',
              ...(!projet.appelOffre.doitPouvoirChoisirCDCInitial && { désactivé: true }),
            }}
          >
            <CahierDesChargesInitial
              {...{
                appelOffre,
                cdcChoisi,
              }}
            />
          </CahierDesChargesSelectionnable>
        </li>

        {cahiersDesChargesModifiésDisponibles.map((cahierDesChargesModifié, index) => {
          const idCdc = formatCahierDesChargesRéférence({
            ...cahierDesChargesModifié,
          });
          const sélectionné = cdcChoisi === idCdc;

          return (
            <li key={`cahier-des-charges-modifié-${index}`}>
              <CahierDesChargesSelectionnable
                {...{
                  id: idCdc,
                  onCahierDesChargesChoisi: (id) => {
                    choisirCdc(id);
                    pouvoirEnregistrerLeChangement(id !== cahierDesChargesActuel);
                  },
                  sélectionné,
                }}
              >
                <div className="flex-column">
                  <CahierDesChargesModifiéDisponible {...cahierDesChargesModifié} />
                </div>
              </CahierDesChargesSelectionnable>
            </li>
          );
        })}
      </ul>

      {projet.délaiCDC2022Appliqué &&
        ['30/08/2022', '30/08/2022-alternatif'].includes(cahierDesChargesActuel) &&
        !['30/08/2022', '30/08/2022-alternatif'].includes(cdcChoisi) && (
          <AlertBox>
            Le cahier des charges que vous séléctionnez ne permet plus au projet de bénéficier du
            délai relatif au cahier des charges modificatif du 30/08/2022.{' '}
            <span className="font-bold">
              Si vous validez ce changement de cahier des charges, la date limite d'achèvement du
              projet sera impactée.
            </span>
          </AlertBox>
        )}

      <div className="mx-auto flex flex-col md:flex-row gap-4 items-center">
        <PrimaryButton type="submit" disabled={!peutEnregistrerLeChangement}>
          Enregistrer mon changement
        </PrimaryButton>
        <SecondaryLinkButton className="ml-3" href={routes.PROJECT_DETAILS(projetId)}>
          Annuler
        </SecondaryLinkButton>
      </div>
    </Form>
  );
};
