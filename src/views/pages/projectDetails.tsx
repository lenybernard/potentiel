import React from 'react'
import moment from 'moment'

import { Project, User, ProjectAdmissionKey } from '../../entities'
import UserDashboard from '../components/userDashboard'
import AdminDashboard from '../components/adminDashboard'
import ProjectActions from '../components/projectActions'
import { porteurProjetActions, adminActions } from '../components/actions'
import { HttpRequest } from '../../types'
import { dataId, testId } from '../../helpers/testId'
import ROUTES from '../../routes'

interface GarantiesFinancieresFormProps {
  projectId: string
  date?: string
}
const GarantiesFinancieresForm = ({
  projectId,
  date,
}: GarantiesFinancieresFormProps) => (
  <form
    action={ROUTES.DEPOSER_GARANTIES_FINANCIERES_ACTION}
    method="post"
    encType="multipart/form-data"
  >
    <div className="form__group">
      <label htmlFor="date">Date de constitution (format JJ/MM/AAAA)</label>
      <input
        type="text"
        name="date"
        id="date"
        {...dataId('date-field')}
        defaultValue={date || ''}
        data-max-date={Date.now()}
      />
      <div
        className="notification error"
        style={{ display: 'none' }}
        {...dataId('error-message-out-of-bounds')}
      >
        Merci de saisir une date antérieure à la date d'aujourd'hui.
      </div>
      <div
        className="notification error"
        style={{ display: 'none' }}
        {...dataId('error-message-wrong-format')}
      >
        Le format de la date saisie n'est pas conforme. Elle doit être de la
        forme JJ/MM/AAAA soit par exemple 25/05/2022 pour 25 Mai 2022.
      </div>
      <label htmlFor="file">Attestation</label>
      <input type="hidden" name="projectId" value={projectId} />
      <input type="file" name="file" {...dataId('file-field')} id="file" />
      <button
        className="button"
        type="submit"
        name="submit"
        id="submit"
        {...dataId('submit-gf-button')}
      >
        Envoyer
      </button>
      <button
        className="button-outline primary"
        {...dataId('frise-hide-content')}
      >
        Annuler
      </button>
    </div>
  </form>
)

interface FriseContainerProps {
  children: React.ReactNode
  displayToggle: boolean
}

const Frise = ({ children, displayToggle }: FriseContainerProps) => (
  <table
    className="frise"
    style={{ borderCollapse: 'collapse', marginBottom: 20 }}
  >
    <thead>
      <tr>
        <td style={{ width: 16 }} />
        <td style={{ width: 16 }} />
        <td />
        <td />
        <td />
      </tr>
    </thead>
    <tbody>
      <tr>
        <td
          style={{
            position: 'relative',
            borderRight: '2px solid var(--lighter-grey)',
            height: 10,
          }}
        ></td>
        <td></td>
      </tr>
      {children}
      {displayToggle ? (
        <tr>
          <td
            style={{
              position: 'relative',
              borderRight: '2px solid var(--lighter-grey)',
            }}
          ></td>
          <td></td>
          <td colSpan={3} style={{ paddingLeft: 5 }}>
            <a
              className="frise--toggle-show"
              href="#"
              {...dataId('frise-show-timeline')}
            >
              Afficher les étapes suivantes
            </a>
            <a
              className="frise--toggle-hide"
              href="#"
              {...dataId('frise-hide-timeline')}
            >
              Masquer les étapes à venir
            </a>
          </td>
        </tr>
      ) : (
        ''
      )}
    </tbody>
  </table>
)

interface FriseItemProps {
  color?: string
  date?: string
  title: string
  action?: { title: string; link?: string; openHiddenContent?: true }
  hiddenContent?: React.ReactNode
  defaultHidden?: boolean
  status?: 'nextup' | 'past' | 'future'
}
const FriseItem = ({
  color,
  defaultHidden,
  date,
  title,
  action,
  hiddenContent,
  status = 'future',
}: FriseItemProps) => {
  return (
    <>
      <tr
        {...dataId('frise-item')}
        className={'frise--item' + (defaultHidden ? ' frise--collapsed' : '')}
      >
        <td
          style={{
            position: 'relative',
            borderRight: '2px solid var(--lighter-grey)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 6,
              left: 3,
              width: 26,
              height: 26,
              textAlign: 'center',
            }}
          >
            {status === 'past' ? (
              <svg
                fill="white"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                width="20"
                height="20"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            ) : status === 'nextup' ? (
              <svg
                fill="white"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                width="20"
                height="20"
                stroke="var(--blue)"
                viewBox="0 0 24 24"
                {...(action && action.openHiddenContent
                  ? {
                      ...dataId('frise-action'),
                      className: 'frise-content-toggle',
                    }
                  : {})}
              >
                <path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            ) : (
              <svg
                fill="white"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                width="20"
                height="20"
                stroke="var(--light-grey)"
                viewBox="0 0 24 24"
              >
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            )}
          </div>
        </td>
        <td></td>
        <td style={{ padding: '0 5px', fontStyle: 'italic' }}>{date || ''}</td>
        <td
          style={{ padding: '0 5px' }}
          {...dataId('frise-title')}
          data-status={status}
        >
          {title}
        </td>
        <td>
          {action ? (
            action.link ? (
              <a href={action.link} {...dataId('frise-action')} download={true}>
                {action.title}
              </a>
            ) : action.openHiddenContent ? (
              <a {...dataId('frise-action')} className="frise-content-toggle">
                {action.title}
              </a>
            ) : (
              <span className="disabled-action">{action.title}</span>
            )
          ) : (
            ''
          )}
        </td>
      </tr>
      {hiddenContent ? (
        <tr {...dataId('frise-hidden-content')} className="hidden">
          <td
            style={{
              position: 'relative',
              borderRight: '2px solid var(--lighter-grey)',
            }}
          ></td>
          <td></td>
          <td></td>
          <td colSpan={2} style={{ padding: '20px 5px 60px' }}>
            {hiddenContent}
          </td>
        </tr>
      ) : (
        ''
      )}
    </>
  )
}

interface SectionProps {
  title: string
  defaultOpen?: boolean
  icon?: string
  children: React.ReactNode
}

const Section = ({ title, defaultOpen, children, icon }: SectionProps) => {
  return (
    <div {...dataId('projectDetails-section')}>
      <h3
        className={'section--title' + (defaultOpen ? ' open' : '')}
        {...dataId('projectDetails-section-toggle')}
      >
        {icon ? (
          <svg className="icon section-icon">
            <use xlinkHref={'#' + icon}></use>
          </svg>
        ) : (
          ''
        )}
        {title}
        <svg className="icon section--expand">
          <use xlinkHref="#expand"></use>
        </svg>
      </h3>
      <div
        className="section--content"
        {...dataId('projectDetails-section-content')}
      >
        {children}
      </div>
    </div>
  )
}

interface NoteElementProps {
  project: Project
  column: string
}
const NoteElement = ({ project, column }: NoteElementProps) => {
  let noteStr: string = project.details && project.details[column]

  if (noteStr) {
    const note = parseFloat(noteStr.replace(',', '.'))

    if (!Number.isNaN(note)) {
      noteStr = (Math.round(note * 100) / 100).toString()
    } else noteStr = 'N/A'
  }

  return (
    <li>
      <b>{column.replace('\n(AO innovation)', '')}</b>: {noteStr || 'N/A'}
    </li>
  )
}

interface ProjectDetailsProps {
  request: HttpRequest
  project: Project
  projectUsers: Array<User>
  projectInvitations: Array<ProjectAdmissionKey>
}

/* Pure component */
export default function ProjectDetails({
  request,
  project,
  projectUsers,
  projectInvitations,
}: ProjectDetailsProps) {
  const { user } = request
  const { error, success } = request.query || {}

  if (!user) {
    // Should never happen
    console.log('Try to render ProjectDetails without a user')
    return <div />
  }

  const Dashboard =
    user.role === 'porteur-projet' ? UserDashboard : AdminDashboard
  return (
    <Dashboard role={user.role} currentPage="list-projects">
      <div className="panel" style={{ padding: 0 }}>
        <div
          className="panel__header"
          style={{
            position: 'relative',
            padding: '1.5em',
            paddingBottom: 0,
            backgroundColor:
              project.classe === 'Classé'
                ? '#daf5e7'
                : 'hsla(5,70%,79%,.45882)',
          }}
        >
          <h3>{project.nomProjet}</h3>
          <span style={{ marginLeft: 10 }}>
            {project.communeProjet}, {project.departementProjet},{' '}
            {project.regionProjet}
          </span>
          <div style={{ fontSize: 13 }}>
            {project.appelOffre?.id} {project.appelOffre?.periode?.title}{' '}
            période
          </div>
          <div
            style={{
              fontWeight: 'bold',
              color:
                project.classe === 'Classé'
                  ? 'rgb(56, 118, 29)'
                  : 'rgb(204, 0, 0)',
            }}
          >
            {project.classe === 'Classé' ? 'Actif' : 'Eliminé'}
          </div>
          <div style={{ position: 'absolute', right: '1.5em', bottom: 25 }}>
            <ProjectActions
              project={project}
              projectActions={
                user.role === 'porteur-projet'
                  ? porteurProjetActions
                  : adminActions
              }
            />
          </div>
        </div>
        <div style={{ padding: '1.5em', paddingTop: 0 }}>
          {success ? (
            <div
              className="notification success"
              {...dataId('success-message')}
            >
              {success}
            </div>
          ) : (
            ''
          )}
          {error ? (
            <div className="notification error" {...dataId('error-message')}>
              {error}
            </div>
          ) : (
            ''
          )}
          <div style={{ position: 'relative' }}>
            <Frise displayToggle={project.classe === 'Classé'}>
              {project.notifiedOn ? (
                <>
                  <FriseItem
                    color="var(--darkest-grey)"
                    date={moment(project.notifiedOn).format('D MMM YYYY')}
                    title="Notification des résultats"
                    status="past"
                    action={
                      project.appelOffre?.periode?.canGenerateCertificate
                        ? {
                            title: "Télécharger l'attestation",
                            link:
                              user.role === 'porteur-projet'
                                ? ROUTES.CANDIDATE_CERTIFICATE_FOR_CANDIDATES(
                                    project
                                  )
                                : ROUTES.CANDIDATE_CERTIFICATE_FOR_ADMINS(
                                    project
                                  ),
                          }
                        : undefined
                    }
                  />
                  {project.classe === 'Classé' ? (
                    <>
                      {project.famille?.garantieFinanciereEnMois ? (
                        // famille soumise à garanties financières
                        project.garantiesFinancieresDate ? (
                          // garanties financières déjà déposées
                          <FriseItem
                            date={moment(
                              project.garantiesFinancieresDate
                            ).format('D MMM YYYY')}
                            title="Constitution des garanties financières"
                            action={{
                              title: "Télécharger l'attestation",
                              link: project.garantiesFinancieresFile.length
                                ? ROUTES.DOWNLOAD_PROJECT_FILE(
                                    project.id,
                                    project.garantiesFinancieresFile
                                  )
                                : undefined,
                            }}
                            status="past"
                          />
                        ) : (
                          // garanties financières non-déposées
                          <FriseItem
                            date={moment(project.notifiedOn)
                              .add(2, 'months')
                              .format('D MMM YYYY')}
                            title="Constitution des garanties financières"
                            action={{
                              title: "Transmettre l'attestation",
                              openHiddenContent:
                                user.role === 'porteur-projet'
                                  ? true
                                  : undefined,
                            }}
                            status="nextup"
                            hiddenContent={
                              <GarantiesFinancieresForm
                                projectId={project.id}
                                date={request.query.date}
                              />
                            }
                          />
                        )
                      ) : (
                        // Famille non-soumises à garanties financières
                        ''
                      )}
                      <FriseItem
                        date={moment(project.notifiedOn)
                          .add(2, 'months')
                          .format('D MMM YYYY')}
                        title="Demande complète de raccordement"
                        action={{
                          title:
                            'Indiquer la date de demande (bientôt disponible)',
                        }}
                        status="nextup"
                      />
                      <FriseItem
                        title="Proposition technique et financière"
                        action={{ title: 'Indiquer la date de signature' }}
                      />
                      <FriseItem
                        title="Convention de raccordement"
                        action={{ title: 'Indiquer la date de signature' }}
                        defaultHidden={true}
                      />
                      <FriseItem
                        date={moment(project.notifiedOn)
                          .add(
                            project.appelOffre?.delaiRealisationEnMois,
                            'months'
                          )
                          .format('D MMM YYYY')}
                        title="Attestation de conformité"
                        action={{ title: "Transmettre l'attestation" }}
                        defaultHidden={true}
                      />
                      <FriseItem
                        title="Mise en service"
                        action={{ title: 'Indiquer la date' }}
                        defaultHidden={true}
                      />
                      <FriseItem
                        title="Contrat d'achat"
                        action={{ title: 'Indiquer la date de signature' }}
                        defaultHidden={true}
                      />
                    </>
                  ) : (
                    ''
                  )}
                </>
              ) : (
                <FriseItem
                  title="Ce projet n'a pas encore été notifié."
                  status="nextup"
                />
              )}
            </Frise>
          </div>
          <Section title="Projet" icon="building">
            <div>
              <h5 style={{ marginBottom: 5 }}>Performances</h5>
              <div>
                Puissance installée: {project.puissance}{' '}
                {project.appelOffre?.unitePuissance}
              </div>
            </div>
            <div>
              <h5 style={{ marginBottom: 5, marginTop: 10 }}>
                Site de production
              </h5>
              <div>{project.adresseProjet}</div>
              <div>
                {project.codePostalProjet} {project.communeProjet}
              </div>
              <div>
                {project.departementProjet}, {project.regionProjet}
              </div>
            </div>
          </Section>
          <Section title="Contact" icon="user-circle">
            <div style={{ marginBottom: 10 }}>{project.nomCandidat}</div>
            <div>
              <h5 style={{ marginBottom: 5 }}>Représentant légal</h5>
              <div>{project.nomRepresentantLegal}</div>
              <div>{project.email}</div>
            </div>
            <div>
              <h5 style={{ marginBottom: 5, marginTop: 15 }}>
                Comptes ayant accès à ce projet
              </h5>
              <ul style={{ marginTop: 5, marginBottom: 5 }}>
                {projectUsers.map((user) => (
                  <li key={'project_user_' + user.id}>
                    {user.fullName} - {user.email}
                  </li>
                ))}
                {projectInvitations.map(({ id, email }) => (
                  <li key={'project_invitation_' + email}>
                    {email} (
                    {user.role === 'admin' ? (
                      <a
                        href={ROUTES.PROJECT_INVITATION({
                          projectAdmissionKey: id,
                        })}
                      >
                        invitation envoyée
                      </a>
                    ) : (
                      <i>invitation envoyée</i>
                    )}
                    )
                  </li>
                ))}
                {!projectUsers.length && !projectInvitations.length ? (
                  <>
                    <li>
                      Aucun utilisateur n'a accès à ce projet pour le moment.
                    </li>
                  </>
                ) : (
                  ''
                )}
              </ul>
            </div>
            <div {...dataId('invitation-form')}>
              <a
                href="#"
                {...dataId('invitation-form-show-button')}
                className="invitationFormToggle"
              >
                Donner accès à un autre utilisateur
              </a>
              <form
                action={ROUTES.INVITE_USER_TO_PROJECT_ACTION}
                method="post"
                name="form"
                className="invitationForm"
              >
                <h5 style={{ marginBottom: 5 }}>
                  Gestion des accès à ce projet
                </h5>
                <input
                  type="hidden"
                  name="projectId"
                  id="projectId"
                  value={project.id}
                />
                <label htmlFor="email">
                  Courrier électronique de la personne habilitée à suivre ce
                  projet
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  {...dataId('email-field')}
                />
                <button
                  className="button"
                  type="submit"
                  name="submit"
                  id="submit"
                  {...dataId('submit-button')}
                >
                  Accorder les droits sur ce projet
                </button>
                <a href="#" {...dataId('invitation-form-hide-button')}>
                  Annuler
                </a>
              </form>
            </div>
          </Section>
          <Section title="Matériels et technologies" icon="cog">
            <div>Fournisseur: {project.fournisseur}</div>
            <div>
              Evaluation carbone simplifiée: {project.evaluationCarbone} kg eq
              CO2/kWc
            </div>
          </Section>
          {project.appelOffre?.id === 'CRE4 - Innovation' ? (
            <Section
              title="Résultats de l'appel d'offres"
              icon="clipboard-check"
            >
              <div style={{ marginBottom: 10, fontSize: 18 }}>
                <b>Note totale</b>: {project.note || 'N/A'}
              </div>
              <ul>
                <NoteElement project={project} column={'Note prix'} />
                <NoteElement
                  project={project}
                  column={'Note innovation\n(AO innovation)'}
                />
                <ul>
                  <NoteElement
                    project={project}
                    column={'Note degré d’innovation (/20pt)\n(AO innovation)'}
                  />
                  <NoteElement
                    project={project}
                    column={
                      'Note positionnement sur le marché (/10pt)\n(AO innovation)'
                    }
                  />
                  <NoteElement
                    project={project}
                    column={'Note qualité technique (/5pt)\n(AO innovation)'}
                  />
                  <NoteElement
                    project={project}
                    column={
                      'Note adéquation du projet avec les ambitions industrielles (/5pt)\n(AO innovation)'
                    }
                  />
                  <NoteElement
                    project={project}
                    column={
                      'Note aspects environnementaux et sociaux (/5pt)\n(AO innovation)'
                    }
                  />
                </ul>
              </ul>
            </Section>
          ) : (
            ''
          )}
        </div>
      </div>
    </Dashboard>
  )
}
