import { projectRepo, userRepo } from '../../dataAccess'
import { User, makeProject } from '../../entities'
import { Success, SystemError } from '../../helpers/responses'
import { HttpRequest } from '../../types'
import makeFakeProject from '../fixtures/project'

const addProjectsForTests = async (request: HttpRequest) => {
  // console.log('addProjectsForTests', request.body)
  const { projects } = request.body
  const { user } = request

  if (!projects || !user) {
    console.log('tests/addProjectsForTests missing projects or user')
    return SystemError('tests/addProjectsForTests missing projects or user')
  }

  const builtProjects = projects
    .map((project) => {
      if (project.notifiedOn) {
        project.notifiedOn = Number(project.notifiedOn)
      }
      if (project.puissance) {
        project.puissance = Number(project.puissance)
      }
      if (project.prixReference) {
        project.prixReference = Number(project.prixReference)
      }
      if (project.evaluationCarbone) {
        project.evaluationCarbone = Number(project.evaluationCarbone)
      }
      if (project.note) {
        project.note = Number(project.note)
      }
      if (project.garantiesFinancieresSubmittedOn) {
        project.garantiesFinancieresSubmittedOn = Number(
          project.garantiesFinancieresSubmittedOn
        )
      }
      if (project.garantiesFinancieresDate) {
        project.garantiesFinancieresDate = Number(
          project.garantiesFinancieresDate
        )
      }
      if (project.details) {
        project.details = JSON.parse(project.details)
      }

      return project
    })
    .map(makeFakeProject)
    // .map((item) => {
    //   console.log(item)
    //   return item
    // })
    .map(makeProject)
    .filter((item) => item.is_ok())
    .map((item) => item.unwrap())

  if (builtProjects.length !== projects.length) {
    console.log('addProjects for Tests could not add all required projects')
    projects
      .map(makeFakeProject)
      .map(makeProject)
      .filter((item) => item.is_err())
      .forEach((erroredProject) => {
        console.log(erroredProject.unwrap_err())
      })
  }

  await Promise.all(builtProjects.map(projectRepo.save))
  // console.log(
  //   '/tests/addProjectsForTests added ' + builtProjects.length + ' projects'
  // )

  await Promise.all(
    builtProjects.map((project) => userRepo.addProject(user.id, project.id))
  )

  return Success('success')
}

export { addProjectsForTests }
