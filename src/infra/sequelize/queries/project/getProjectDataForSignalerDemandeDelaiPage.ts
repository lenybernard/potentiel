import { err, ok, Result, ResultAsync, wrapInfra } from '@core/utils'
import { parseCahierDesChargesRéférence } from '@entities'
import {
  GetProjectDataForSignalerDemandeDelaiPage,
  ProjectDataForSignalerDemandeDelaiPage,
} from '@modules/project'
import { EntityNotFoundError, InfraNotAvailableError } from '@modules/shared'
import { Op } from 'sequelize'
import models from '../../models'
import { getDélaiCDC2022Applicable } from './getDélaiCdc2022Applicable'

const { Project, ModificationRequest } = models

export const getProjectDataForSignalerDemandeDelaiPage: GetProjectDataForSignalerDemandeDelaiPage =
  ({ projectId }) => {
    return wrapInfra(Project.findByPk(projectId))
      .andThen(
        (
          projectRaw: any
        ): Result<
          Omit<ProjectDataForSignalerDemandeDelaiPage, 'hasPendingDemandeDelai'>,
          EntityNotFoundError
        > => {
          if (!projectRaw) return err(new EntityNotFoundError())
          const {
            id,
            completionDueOn,
            nomProjet,
            nomCandidat,
            communeProjet,
            regionProjet,
            departementProjet,
            notifiedOn,
            periodeId,
            familleId,
            appelOffreId,
            cahierDesChargesActuel,
          } = projectRaw.get()

          const project = {
            id,
            nomProjet,
            ...(completionDueOn > 0 && { completionDueOn }),
            nomCandidat,
            communeProjet,
            regionProjet,
            departementProjet,
            notifiedOn,
            periodeId,
            familleId,
            appelOffreId,
            cahierDesChargesActuel,
          }

          const cahierDesChargesParsed = parseCahierDesChargesRéférence(cahierDesChargesActuel)

          if (
            cahierDesChargesParsed.type === 'modifié' &&
            cahierDesChargesParsed.paruLe === '30/08/2022'
          ) {
            const délaiCDC2022Applicable = getDélaiCDC2022Applicable({
              familleId,
              periodeId,
              appelOffreId,
              cahierDesChargesParsed,
            })

            return ok({ ...project, délaiCDC2022Applicable })
          }

          return ok(project)
        }
      )
      .andThen((project) => {
        return hasPendingDemandeDelai(project.id).andThen((count) =>
          ok({
            ...project,
            hasPendingDemandeDelai: count > 0 ? true : false,
          })
        )
      })
  }

const hasPendingDemandeDelai: (projectId: string) => ResultAsync<number, InfraNotAvailableError> = (
  projectId
) =>
  wrapInfra(
    ModificationRequest.findAndCountAll({
      where: {
        projectId,
        type: 'delai',
        status: { [Op.notIn]: ['acceptée', 'rejetée', 'annulée'] },
      },
    })
  ).andThen(({ count }) => ok(count))
