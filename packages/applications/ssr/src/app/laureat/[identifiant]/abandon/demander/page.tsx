import { mediator } from 'mediateur';
import { ConsulterCandidatureQuery } from '@potentiel-domain/candidature';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { getUser } from '@/utils/getUtilisateur';
import { redirect } from 'next/navigation';
import {
  DemanderAbandonPage,
  DemanderAbandonPageProps,
} from '@/components/pages/abandon/DemanderAbandonPage';
import { CahierDesCharges } from '@potentiel-domain/laureat';
import { ConsulterAppelOffreQuery } from '@potentiel-domain/appel-offre';
import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { VérifierAccèsProjetQuery } from '@potentiel-domain/utilisateur';

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(identifiant);

    const utilisateur = await getUser();
    if (!utilisateur) {
      redirect('/login.html');
    }

    // TODO : Rendre cette vérification automatiquement lors de l'exécution
    //        d'un(e) query/usecase avec un identifiantProjet
    if (utilisateur.rôle === 'porteur-projet') {
      await mediator.send<VérifierAccèsProjetQuery>({
        type: 'VERIFIER_ACCES_PROJET_QUERY',
        data: {
          identifiantProjet,
          identifiantUtilisateur: utilisateur.email,
        },
      });
    }

    const candidature = await mediator.send<ConsulterCandidatureQuery>({
      type: 'CONSULTER_CANDIDATURE_QUERY',
      data: {
        identifiantProjet,
      },
    });

    const appelOffres = await mediator.send<ConsulterAppelOffreQuery>({
      type: 'CONSULTER_APPEL_OFFRE_QUERY',
      data: { identifiantAppelOffre: candidature.appelOffre },
    });

    const { cahierDesChargesChoisi } =
      await mediator.send<CahierDesCharges.ConsulterCahierDesChargesChoisiQuery>({
        type: 'CONSULTER_CAHIER_DES_CHARGES_QUERY',
        data: {
          identifiantProjet,
        },
      });

    if (appelOffres.choisirNouveauCahierDesCharges && cahierDesChargesChoisi === 'initial') {
      redirect(`/projet/${encodeURIComponent(identifiantProjet)}/details.html`);
    }

    // TODO: extract the logic in a dedicated function mapToProps
    // identifiantProjet must come from the readmodel as a value type
    const demanderAbandonPageProps: DemanderAbandonPageProps = {
      utilisateur,
      projet: { ...candidature, identifiantProjet },
    };

    return <DemanderAbandonPage {...{ ...demanderAbandonPageProps }} />;
  });
}
