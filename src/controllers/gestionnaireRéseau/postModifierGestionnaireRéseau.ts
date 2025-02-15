import routes from '../../routes';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { v1Router } from '../v1Router';
import * as yup from 'yup';

import { addQueryParams } from '../../helpers/addQueryParams';
import { logger } from '../../core/utils';
import { errorResponse, vérifierPermissionUtilisateur } from '../helpers';
import {
  DomainUseCase,
  convertirEnIdentifiantGestionnaireRéseau,
} from '@potentiel/domain-usecases';
import { PermissionModifierGestionnaireRéseau } from '@potentiel/legacy-permissions';
import { mediator } from 'mediateur';
import { NotFoundError } from '@potentiel-domain/core';

const schema = yup.object({
  body: yup.object({
    raisonSociale: yup.string().required('La raison sociale est obligatoire'),
    format: yup.string().optional(),
    légende: yup.string().optional(),
    expressionReguliere: yup.string().optional(),
  }),
});

v1Router.post(
  routes.POST_MODIFIER_GESTIONNAIRE_RESEAU(),
  vérifierPermissionUtilisateur(PermissionModifierGestionnaireRéseau),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response, errors }) =>
        response.redirect(
          addQueryParams(routes.GET_DETAIL_GESTIONNAIRE_RESEAU(request.params.codeEIC), {
            ...request.body,
            errors: JSON.stringify(errors),
          }),
        ),
    },
    async (request, response) => {
      const {
        body: { format = '', légende = '', raisonSociale, expressionReguliere = '' },
        params: { codeEIC },
      } = request;
      try {
        await mediator.send<DomainUseCase>({
          type: 'MODIFIER_GESTIONNAIRE_RÉSEAU_USECASE',
          data: {
            identifiantGestionnaireRéseau: convertirEnIdentifiantGestionnaireRéseau(codeEIC),
            aideSaisieRéférenceDossierRaccordement: { format, légende, expressionReguliere },
            raisonSociale,
          },
        });

        response.redirect(
          addQueryParams(routes.GET_LISTE_GESTIONNAIRES_RESEAU, {
            success: 'Le gestionnaire a bien été modifié.',
          }),
        );
      } catch (error) {
        if (error instanceof NotFoundError) {
          return response.redirect(
            addQueryParams(routes.GET_LISTE_GESTIONNAIRES_RESEAU, {
              error: error.message,
            }),
          );
        }

        logger.error(error);
        return errorResponse({
          request,
          response,
          customMessage: `Une erreur est survenue. Veuillez répéter l'opération ou contacter un administrateur.`,
        });
      }
    },
  ),
);
