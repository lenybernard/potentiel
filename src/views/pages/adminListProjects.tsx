import AdminDashboard from '../components/adminDashboard'

import React from 'react'

import { Project, AppelOffre, Periode, Famille } from '../../entities'
import ROUTES from '../../routes'
import { dataId } from '../../helpers/testId'
import { asLiteral } from '../../helpers/asLiteral'

import ProjectList from '../components/projectList'
import { adminActions } from '../components/actions'
import { HttpRequest, PaginatedList } from '../../types'

interface AdminListProjectsProps {
  request: HttpRequest
  projects: PaginatedList<Project> | Array<Project>
  appelsOffre: Array<AppelOffre>
  selectedAppelOffreId?: AppelOffre['id']
  selectedPeriodeId?: Periode['id']
  selectedFamilleId?: Famille['id']
}

/* Pure component */
export default function AdminListProjects({
  request,
  projects,
  appelsOffre,
  selectedAppelOffreId,
  selectedPeriodeId,
  selectedFamilleId,
}: AdminListProjectsProps) {
  const { error, success } = request.query || {}
  return (
    <AdminDashboard role={request.user?.role} currentPage="list-projects">
      <div className="panel">
        <div className="panel__header">
          <h3>Projets</h3>

          <div className="form__group">
            <legend>Filtrer par AO, Période et/ou Famille</legend>
            <select
              name="appelOffre"
              id="appelOffre"
              {...dataId('appelOffreSelector')}
            >
              <option value="">Tous AO</option>
              {appelsOffre.map((appelOffre) => (
                <option
                  key={'appel_' + appelOffre.id}
                  value={appelOffre.id}
                  selected={appelOffre.id === selectedAppelOffreId}
                >
                  {appelOffre.shortTitle}
                </option>
              ))}
            </select>
            <select name="periode" id="periode" {...dataId('periodeSelector')}>
              <option value="">Toutes périodes</option>
              {appelsOffre
                .find((ao) => ao.id === selectedAppelOffreId)
                ?.periodes.map((periode) => (
                  <option
                    key={'appel_' + periode.id}
                    value={periode.id}
                    selected={periode.id === selectedPeriodeId}
                  >
                    {periode.title}
                  </option>
                ))}
            </select>
            <select name="famille" id="famille" {...dataId('familleSelector')}>
              <option value="">Toutes familles</option>
              {appelsOffre
                .find((ao) => ao.id === selectedAppelOffreId)
                ?.familles.sort((a, b) => a.title.localeCompare(b.title))
                .map((famille) => (
                  <option
                    key={'appel_' + famille.id}
                    value={famille.id}
                    selected={famille.id === selectedFamilleId}
                  >
                    {famille.title}
                  </option>
                ))}
            </select>
          </div>
        </div>
        {success ? (
          <div className="notification success" {...dataId('success-message')}>
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
        <div className="pagination__count">
          <strong>
            {Array.isArray(projects) ? projects.length : projects.itemCount}
          </strong>{' '}
          projets
        </div>
        <ProjectList
          displayColumns={[
            'Periode',
            'Projet',
            'Candidat',
            'Puissance',
            ...(request.user?.role === 'admin' ? ['Prix'] : []),
            'Evaluation Carbone',
            'Classé',
          ]}
          projects={projects}
          projectActions={
            request.user?.role === 'admin' ? adminActions : undefined
          }
        />
      </div>
    </AdminDashboard>
  )
}
