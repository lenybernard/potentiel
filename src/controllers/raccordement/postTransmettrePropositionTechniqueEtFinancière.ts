import { mediator } from 'mediateur';
import {
  DomainUseCase,
  RawIdentifiantProjet,
  convertirEnDateTime,
  convertirEnIdentifiantProjet,
  convertirEnRéférenceDossierRaccordement,
  estUnRawIdentifiantProjet,
} from '@potentiel/domain-usecases';
import { PermissionTransmettrePropositionTechniqueEtFinancière } from '@potentiel/legacy-permissions';
import routes from '../../routes';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { FileReadableStream } from '../../helpers/fileReadableStream';
import {
  errorResponse,
  iso8601DateToDateYupTransformation,
  notFoundResponse,
  unauthorizedResponse,
  vérifierPermissionUtilisateur,
} from '../helpers';
import { Project, UserProjects } from '../../infra/sequelize/projectionsNext';
import { addQueryParams } from '../../helpers/addQueryParams';
import { logger } from '../../core/utils';
import { upload as uploadMiddleware } from '../upload';
import { isSome } from '@potentiel/monads';
import { DomainError } from '@potentiel-domain/core';

const schema = yup.object({
  params: yup.object({
    identifiantProjet: yup.string().required(),
    reference: yup.string().required(),
  }),
  body: yup.object({
    dateSignature: yup
      .date()
      .required(`La date de signature est obligatoire.`)
      .nullable()
      .transform(iso8601DateToDateYupTransformation)
      .typeError(`La date de signature n'est pas valide.`),
  }),
});

v1Router.post(
  routes.POST_TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIERE(),
  uploadMiddleware.single('file'),
  vérifierPermissionUtilisateur(PermissionTransmettrePropositionTechniqueEtFinancière),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response, error }) =>
        response.redirect(
          addQueryParams(
            routes.GET_TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIERE_PAGE(
              request.params.identifiantProjet as RawIdentifiantProjet,
              request.params.reference,
            ),
            {
              error: `Votre proposition technique et financière n'a pas pu être ajoutée au dossier dans Potentiel. ${error.errors.join(
                ' ',
              )}`,
            },
          ),
        ),
    },
    async (request, response) => {
      const {
        params: { identifiantProjet, reference },
        body: { dateSignature },
        file,
        user,
      } = request;

      if (!estUnRawIdentifiantProjet(identifiantProjet)) {
        return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
      }
      if (!file) {
        return response.redirect(
          addQueryParams(
            routes.GET_TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIERE_PAGE(identifiantProjet),
            {
              error: `Vous devez joindre la proposition technique et financière`,
            },
          ),
        );
      }

      const identifiantProjetValueType = convertirEnIdentifiantProjet(identifiantProjet);

      const projet = await Project.findOne({
        where: {
          appelOffreId: identifiantProjetValueType.appelOffre,
          periodeId: identifiantProjetValueType.période,
          familleId: isSome(identifiantProjetValueType.famille)
            ? identifiantProjetValueType.famille
            : '',
          numeroCRE: identifiantProjetValueType.numéroCRE,
        },
        attributes: ['id'],
      });

      if (!projet) {
        return notFoundResponse({
          request,
          response,
          ressourceTitle: 'Projet',
        });
      }

      if (user.role === 'porteur-projet') {
        const porteurAAccèsAuProjet = !!(await UserProjects.findOne({
          where: { projectId: projet.id, userId: user.id },
        }));

        if (!porteurAAccèsAuProjet) {
          return unauthorizedResponse({
            request,
            response,
            customMessage: `Vous n'avez pas accès à ce projet.`,
          });
        }
      }

      try {
        await mediator.send<DomainUseCase>({
          type: 'TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE',
          data: {
            identifiantProjet: identifiantProjetValueType,
            référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement(reference),
            dateSignature: convertirEnDateTime(dateSignature),
            propositionTechniqueEtFinancièreSignée: {
              format: file.mimetype,
              content: new FileReadableStream(file.path),
            },
          },
        });

        return response.redirect(
          routes.SUCCESS_OR_ERROR_PAGE({
            success: 'La proposition technique et financière a bien été enregistrée',
            redirectUrl: routes.GET_LISTE_DOSSIERS_RACCORDEMENT(identifiantProjet),
            redirectTitle: 'Retourner sur la page raccordement',
          }),
        );
      } catch (error) {
        if (error instanceof DomainError) {
          return response.redirect(
            addQueryParams(
              routes.GET_TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIERE_PAGE(
                identifiantProjet,
                reference,
              ),
              {
                error: error.message,
              },
            ),
          );
        }

        logger.error(error);

        return errorResponse({ request, response });
      }
    },
  ),
);
