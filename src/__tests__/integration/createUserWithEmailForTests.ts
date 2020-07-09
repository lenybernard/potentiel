import {
  projectRepo,
  userRepo,
  projectAdmissionKeyRepo,
} from '../../dataAccess'
import { User, makeProject, makeProjectAdmissionKey } from '../../entities'
import { Success, SystemError } from '../../helpers/responses'
import { HttpRequest } from '../../types'
import ROUTES from '../../routes'
import makeFakeProject from '../fixtures/project'
import { createUser } from './helpers/createUser'

const createUserWithEmailForTests = async (request: HttpRequest) => {
  // console.log('createUserWithEmailForTests', request, request.user)
  const { email } = request.body

  if (!email) {
    console.log('createUserWithEmailForTests missing email')
    return SystemError('missing email')
  }

  const [user] = await userRepo.findAll({ email, role: 'dreal' })

  // Create a test porteur projet
  const userId = await createUser({
    email,
    fullName: 'Porteur de Projet',
    password: 'test',
    role: 'porteur-projet',
  })

  return Success(userId)
}

export { createUserWithEmailForTests }
