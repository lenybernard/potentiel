import { listerGestionnairesRéseau } from '@infra/sequelize/queries/gestionnaireRéseau/listerGestionnaireRéseau';
import { PermissionListerGestionnairesRéseau } from '@modules/gestionnaireRéseau/lister/ListerGestionnairesRéseau';
import routes from '@routes';
import { ListeGestionnairesRéseauPage } from '@views';
import { vérifierPermissionUtilisateur } from '../helpers';
import asyncHandler from '../helpers/asyncHandler';
import { v1Router } from '../v1Router';

v1Router.get(
  routes.GET_LISTE_GESTIONNAIRES_RESEAU,
  vérifierPermissionUtilisateur(PermissionListerGestionnairesRéseau),
  asyncHandler(async (request, response) => {
    const gestionnairesRéseau = await listerGestionnairesRéseau();
    const { user } = request;
    return response.send(
      ListeGestionnairesRéseauPage({
        user,
        gestionnairesRéseau,
      }),
    );
  }),
);
