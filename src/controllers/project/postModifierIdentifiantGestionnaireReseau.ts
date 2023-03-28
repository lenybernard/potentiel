import { renseignerIdentifiantGestionnaireRéseau } from '@config';
import { logger } from '@core/utils';
import {
  IdentifiantGestionnaireRéseauExistantError,
  IdentifiantGestionnaireRéseauObligatoireError,
} from '@modules/project';
import routes from '@routes';
import { addQueryParams } from '../../helpers/addQueryParams';
import { object, string } from 'yup';
import { errorResponse } from '../helpers';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { v1Router } from '../v1Router';

const schema = object({
  body: object({
    projetId: string().uuid().required(),
    identifiantGestionnaireRéseau: string().required("L'identifiant est obligatoire"),
    codeEICGestionnaireRéseau: string().optional(),
  }),
});

v1Router.post(
  routes.POST_MODIFIER_IDENTIFIANT_GESTIONNAIRE_RESEAU,
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response, error }) =>
        response.redirect(
          addQueryParams(
            routes.GET_MODIFIER_IDENTIFIANT_GESTIONNAIRE_RESEAU(request.body.projetId),
            {
              error: error.errors.join(''),
            },
          ),
        ),
    },
    async (request, response) => {
      const {
        body: { projetId, identifiantGestionnaireRéseau, codeEICGestionnaireRéseau },
        user,
      } = request;

      return renseignerIdentifiantGestionnaireRéseau({
        projetId,
        utilisateur: user,
        identifiantGestionnaireRéseau,
      }).match(
        () =>
          response.redirect(
            addQueryParams(routes.PROJECT_DETAILS(request.body.projetId), {
              success: 'Les données du gestionnaire de réseau ont bien été mises à jour.',
            }),
          ),
        (error) => {
          if (
            error instanceof IdentifiantGestionnaireRéseauExistantError ||
            error instanceof IdentifiantGestionnaireRéseauObligatoireError
          ) {
            return response.redirect(
              addQueryParams(routes.GET_MODIFIER_IDENTIFIANT_GESTIONNAIRE_RESEAU(projetId), {
                error: error.message,
              }),
            );
          }
          logger.error(error);
          return errorResponse({
            request,
            response,
            customMessage:
              'Il y a eu une erreur lors de la soumission de votre demande. Merci de recommencer.',
          });
        },
      );
    },
  ),
);
