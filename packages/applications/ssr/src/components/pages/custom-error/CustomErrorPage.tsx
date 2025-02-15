import { FC } from 'react';
import Image from 'next/image';
import { Heading1 } from '@/components/atoms/headings';

type ErrorType =
  | 'NotFoundError'
  | 'InvalidOperationError'
  | 'OperationRejectedError'
  | 'ServerError';

export type CustomErrorProps = {
  type: ErrorType;
  statusCode: '400' | '403' | '404' | '500';
};

export const CustomErrorPage: FC<CustomErrorProps> = ({ type, statusCode }) => {
  const title = type === 'NotFoundError' ? 'Page non trouvée' : 'Une erreur est survenue';
  const description = getDescription(type);

  return (
    <div className="fr-container">
      <div className="fr-my-7w fr-mt-md-12w fr-mb-md-10w fr-grid-row fr-grid-row--gutters fr-grid-row--middle fr-grid-row--center">
        <div className="fr-py-0 fr-col-12 fr-col-md-6">
          <Heading1>{title}</Heading1>
          <p className="fr-text--sm fr-mb-3w">Erreur {statusCode}</p>
          {description}
          <ul className="fr-btns-group fr-btns-group--inline-md">
            <li>
              <a className="fr-btn" href="/">
                Page d'accueil
              </a>
            </li>
          </ul>
        </div>
        <div className="fr-col-12 fr-col-md-3 fr-col-offset-md-1 fr-px-6w fr-px-md-0 fr-py-0">
          <Image
            src="/illustrations/error.svg"
            width={282}
            height={319}
            alt="Illustration représentant une page web"
            aria-hidden={true}
            priority
          />
        </div>
      </div>
    </div>
  );
};

function getDescription(type: ErrorType) {
  switch (type) {
    case 'NotFoundError':
      return (
        <>
          <p className="fr-text--lead fr-mb-3w">
            La page que vous cherchez est introuvable. Excusez-nous pour la gène occasionnée.
          </p>
          <p className="fr-text--sm fr-mb-5w">
            Si vous avez tapé l'adresse web dans le navigateur, vérifiez qu'elle est correcte. La
            page n’est peut-être plus disponible. <br />
            Dans ce cas, pour continuer votre visite vous pouvez consulter notre page d’accueil, ou
            effectuer une recherche avec notre moteur de recherche en haut de page.
            <br />
            Sinon contactez-nous via notre outil crisp (bouton en bas à droite de l'écran) pour que
            l’on puisse vous rediriger vers la bonne information.
          </p>
        </>
      );
    case 'OperationRejectedError':
      return (
        <>
          <p className="fr-text--lead fr-mb-3w">Vous n'êtes pas autorisé à accéder à cette page.</p>
          <p className="fr-text--sm fr-mb-5w">
            S'il s'agit d'un projet, veuillez contacter le responsable pour qu'il vous octroie les
            droits nécessaires.
            <br />
            Sinon contactez-nous via notre outil crisp (bouton en bas à droite de l'écran) pour que
            l’on puisse vous rediriger vers la bonne information.
          </p>
        </>
      );

    case 'InvalidOperationError':
    case 'ServerError':
    default:
      return (
        <>
          <p className="fr-text--lead fr-mb-3w">
            Désolé, le service rencontre un problème, nous travaillons pour le résoudre le plus
            rapidement possible.
          </p>
          <p className="fr-text--sm fr-mb-5w">
            Essayez de rafraîchir la page ou bien ressayez plus tard. <br />
            Si vous avez besoin d’une aide immédiate, merci de nous contacter.
          </p>
        </>
      );
  }
}
