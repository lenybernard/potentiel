import { PaginationPanel, ProjectActions } from '@components'
import { Project } from '@entities'
import { UserRole } from '@modules/users'
import routes from '@routes'
import React, { ReactNode } from 'react'
import { formatDate } from '../../helpers/formatDate'
import { PaginatedList } from '../../types'
import { Badge, DownloadLink, Link, LinkButton, Tile } from './UI'
import {
  PowerIcon,
  EuroIcon,
  CloudIcon,
  MapPinIcon,
  BuildingHouseIcon,
  UserIcon,
} from './UI/atoms/icons'

const Unit = ({ children }: { children: ReactNode }) => (
  <span className="italic text-sm">{children}</span>
)

const StatutBadge = ({ project }: { project: Project }) => {
  if (project.abandonedOn) {
    return <Badge type="warning">Abandonné</Badge>
  }

  if (project.classe === 'Eliminé') {
    return <Badge type="error">Eliminé</Badge>
  }

  const type = project.isFinancementParticipatif
    ? 'FP'
    : project.isInvestissementParticipatif
    ? 'IP'
    : project.actionnariat === 'financement-collectif'
    ? 'FC'
    : project.actionnariat === 'gouvernance-partagee'
    ? 'GP'
    : ''

  return <Badge type="success">Classé {type ? `(${type})` : ''}</Badge>
}

type Props = {
  projects: PaginatedList<Project> | Array<Project>
  displayGF?: true
  role: UserRole
  GFPastDue?: boolean
  displaySelection?: boolean
  selectedIds?: string[]
  onSelectedIdsChanged?: (projectIds: string[]) => void
}

export const ProjectList = ({
  projects,
  displayGF,
  role,
  GFPastDue,
  selectedIds = [],
  displaySelection = false,
  onSelectedIdsChanged,
}: Props) => {
  let items: Array<Project>
  if (Array.isArray(projects)) {
    items = projects
  } else {
    items = projects.items
  }

  if (!items.length) {
    return (
      <table className="table">
        <tbody>
          <tr>
            <td>Aucun projet à lister</td>
          </tr>
        </tbody>
      </table>
    )
  }

  const toggleSelected = (projectId: string, value: boolean) => {
    const newSelectedIds = selectedIds.slice()
    if (value) {
      newSelectedIds.push(projectId)
    } else {
      const index = newSelectedIds.indexOf(projectId)
      newSelectedIds.splice(index, 1)
    }
    onSelectedIdsChanged?.(newSelectedIds)
  }

  return (
    <>
      <legend className="flex flex-col md:flex-row gap-2 mb-2 text-sm" aria-hidden>
        <div className="flex items-center">
          <PowerIcon
            className="text-yellow-moutarde-850-base mr-1 shrink-0"
            aria-label="Puissance"
          />{' '}
          Puissance
        </div>
        <div className="flex items-center">
          <EuroIcon
            className="text-orange-terre-battue-main-645-base mr-1 shrink-0"
            aria-label="Prix de référence"
          />{' '}
          Prix de référence
        </div>
        {displayGF ? (
          <div className="flex items-center">
            <div
              className="flex text-grey-200-base font-bold text-sm mr-1"
              aria-label="Garanties Financières"
            >
              GF
            </div>
            Garanties Financières
          </div>
        ) : (
          <div className="flex items-center">
            <CloudIcon
              className="text-grey-425-active mr-1 shrink-0"
              aria-label="Évaluation carbone"
            />
            Évaluation carbone
          </div>
        )}
      </legend>

      {items.map((project) => {
        return (
          <Tile className="mb-4 flex md:relative flex-col" key={'project_' + project.id}>
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex flex-col md:flex-row gap-2">
                {displaySelection && (
                  <input
                    onChange={(e) => toggleSelected(project.id, e.target.checked)}
                    type="checkbox"
                    value={project.id}
                  />
                )}
                <Link href={routes.PROJECT_DETAILS(project.id)}>{project.nomProjet}</Link>
                <StatutBadge project={project} />
              </div>
              <div className="italic text-xs text-grey-425-base">{project.potentielIdentifier}</div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 md:items-center">
              <div className="flex md:flex-1 flex-col gap-1 text-sm">
                <div className="flex items-center">
                  <MapPinIcon className="mr-2 shrink-0" />
                  <span className="italic">
                    {project.communeProjet}, {project.departementProjet}, {project.regionProjet}
                  </span>
                </div>

                <div className="flex  items-center">
                  <BuildingHouseIcon className="mr-2 shrink-0" />
                  {project.nomCandidat}
                </div>
                <div className="flex items-center">
                  <UserIcon className="mr-2 shrink-0" />
                  <div className="flex flex-col overflow-hidden">
                    <div>{project.nomRepresentantLegal}</div>
                    <div className="truncate" title={project.email}>
                      {project.email}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex md:flex-1 lg:flex flex-col lg:flex-row lg:gap-4">
                <div className="flex lg:flex-1 lg:flex-col items-center gap-2" title="Puissance">
                  <PowerIcon className="text-yellow-moutarde-850-base" aria-label="Puissance" />
                  <div className="lg:flex lg:flex-col items-center">
                    {project.puissance} <Unit>{project.appelOffre?.unitePuissance}</Unit>
                  </div>
                </div>
                <div
                  className="flex lg:flex-1 lg:flex-col items-center gap-2"
                  title="Prix de référence"
                >
                  <EuroIcon
                    className="text-orange-terre-battue-main-645-base"
                    aria-label="Prix de référence"
                  />
                  <div className="lg:flex lg:flex-col items-center">
                    {project.prixReference} <Unit>€/MWh</Unit>
                  </div>
                </div>

                {displayGF ? (
                  <GF project={project} GFPastDue={GFPastDue} />
                ) : (
                  <div
                    className="flex lg:flex-1 lg:flex-col items-center gap-2 lg:grow"
                    title="Évaluation carbone"
                  >
                    <CloudIcon className="text-grey-425-active" aria-label="Évaluation carbone" />
                    <div>
                      {project.evaluationCarbone > 0 ? (
                        <div className="lg:flex lg:flex-col items-center text-center">
                          {project.evaluationCarbone}
                          <Unit> kg eq CO2/kWc</Unit>
                        </div>
                      ) : (
                        '- - -'
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex md:absolute md:top-4 md:right-5 gap-2">
                <ProjectActions
                  role={role}
                  project={{
                    ...project,
                    isClasse: project.classe === 'Classé',
                    isAbandoned: project.abandonedOn !== 0,
                    notifiedOn: project.notifiedOn ? new Date(project.notifiedOn) : undefined,
                  }}
                />
                <LinkButton href={routes.PROJECT_DETAILS(project.id)}>Voir</LinkButton>
              </div>
            </div>
          </Tile>
        )
      })}
      {!Array.isArray(projects) && (
        <PaginationPanel
          pagination={projects.pagination}
          pageCount={projects.pageCount}
          itemTitle="Projets"
        />
      )}
    </>
  )
}

const GF = ({ project, GFPastDue }: { project: Project; GFPastDue?: boolean }) => (
  <div
    className="flex lg:flex-1 lg:flex-col gap-1 mt-1 md:items-center"
    title="Garanties financières"
  >
    <div className="flex text-grey-200-base font-bold text-sm pt-0.5">GF</div>
    {!project.garantiesFinancieresSubmittedOn && !GFPastDue && (
      <div className="flex">Non Déposées</div>
    )}

    {project.garantiesFinancieresSubmittedOn !== 0 && (
      <div className="flex flex-col md:flex-row lg:flex-col items-center gap-1">
        {project.gf?.status === 'validé' ? (
          <Badge className="lg:self-center" type="success">
            validé
          </Badge>
        ) : (
          <Badge className="lg:self-center" type="warning">
            à traiter
          </Badge>
        )}
        {project.garantiesFinancieresFileRef && (
          <DownloadLink
            className="flex text-sm"
            fileUrl={routes.DOWNLOAD_PROJECT_FILE(
              project.garantiesFinancieresFileRef.id,
              project.garantiesFinancieresFileRef.filename
            )}
          >
            Déposées le {formatDate(project.garantiesFinancieresSubmittedOn)}
          </DownloadLink>
        )}
      </div>
    )}

    {GFPastDue && (
      <DownloadLink
        className="text-sm"
        fileUrl={routes.TELECHARGER_MODELE_MISE_EN_DEMEURE({
          id: project.id,
          nomProjet: project.nomProjet,
        })}
      >
        Télécharger le modèle de mise de demeure
      </DownloadLink>
    )}
  </div>
)
