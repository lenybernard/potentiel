import { Message, MessageHandler, mediator } from 'mediateur';
import { UtilisateurProjection } from '../utilisateur.projection';
import { isNone, Option } from '@potentiel/monads';
import { UtilisateurInconnuErreur } from '../utilisateurInconnu.error';
import { IdentifiantUtilisateur } from '..';

export type ConsulterUtilisateurReadModel = {
  identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
  email: string;
  nomComplet: string;
  fonction: string;
};

export type ConsulterUtilisateurQuery = Message<
  'CONSULTER_UTILISATEUR_QUERY',
  {
    identifiantUtilisateur: string;
  },
  ConsulterUtilisateurReadModel
>;

export type RécupérerUtilisateurPort = (
  identifiantUtilisateur: string,
) => Promise<Option<UtilisateurProjection>>;

export type ConsulterUtilisateurDependencies = {
  récupérerUtilisateur: RécupérerUtilisateurPort;
};

export const registerConsulterUtilisateurQuery = ({
  récupérerUtilisateur,
}: ConsulterUtilisateurDependencies) => {
  const handler: MessageHandler<ConsulterUtilisateurQuery> = async ({ identifiantUtilisateur }) => {
    const result = await récupérerUtilisateur(identifiantUtilisateur);

    if (isNone(result)) {
      throw new UtilisateurInconnuErreur();
    }

    return mapToReadModel(result);
  };

  mediator.register('CONSULTER_UTILISATEUR_QUERY', handler);
};

const mapToReadModel = ({
  identifiantUtilisateur,
  email,
  nomComplet,
  fonction,
}: UtilisateurProjection): ConsulterUtilisateurReadModel => ({
  identifiantUtilisateur: IdentifiantUtilisateur.convertirEnValueType(identifiantUtilisateur),
  email,
  nomComplet,
  fonction,
});
