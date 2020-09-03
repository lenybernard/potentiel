import { Op } from 'sequelize'
import {
  initDatabase,
  userRepo,
  projectRepo,
  modificationRequestRepo,
  sequelize,
} from '../src/dataAccess'
import {
  makeUser,
  makeCredentials,
  User,
  applyProjectUpdate,
  ModificationRequest,
} from '../src/entities'
import { File } from '../src/modules/file'
import { makeProjectFilePath } from '../src/helpers/makeProjectFilePath'
import { asLiteral } from '../src/helpers/asLiteral'
import { fileService } from '../src/config'

import fs from 'fs'
import util from 'util'
import path, { relative } from 'path'
const moveFile = util.promisify(fs.rename)
const dirExists = util.promisify(fs.exists)
const fileExists = dirExists
const deleteFile = util.promisify(fs.unlink)

initDatabase()
  .then(async () => {
    // Get all projects with a garantiesFinancieresFile and no garantiesFinancieresFileId

    const ModificationRequestModel = sequelize.model('modificationRequest')
    const requestsToUpdate = await ModificationRequestModel.findAll({
      where: {
        filename: {
          [Op.and]: [{ [Op.ne]: '' }, { [Op.ne]: null }],
        },
        fileId: null,
      },
      // logging: console.log,
    })

    console.log(
      'Found',
      requestsToUpdate.length,
      'modification requests to update'
    )

    const updatedProjects: any[] = []

    for (const request of requestsToUpdate.map((item) => item.get())) {
      const { filepath: relativeFilePath, filename } = makeProjectFilePath(
        request.projectId,
        request.filename,
        true
      )
      const absoluteFilePath = path.resolve(__dirname, '../', relativeFilePath)

      if (!(await fileExists(absoluteFilePath))) {
        console.log('\nFile with path', absoluteFilePath, 'could not be found')
        continue
      }

      const file = {
        stream: fs.createReadStream(absoluteFilePath),
        path: relativeFilePath,
      }

      const fileResult = File.create({
        designation: 'modification-request',
        forProject: request.projectId,
        createdBy: request.userId,
        filename: filename,
      })

      if (fileResult.isErr()) {
        console.log('File.create failed', fileResult.error)

        continue
      }

      console.log('\nUploading file ' + relativeFilePath)
      const saveFileResult = await fileService.save(fileResult.value, {
        ...file,
        path: relativeFilePath,
      })

      if (saveFileResult.isErr()) {
        // OOPS
        console.log('fileService.save failed', saveFileResult.error)

        continue
      }
      console.log('Done uploading file.')

      const res = await modificationRequestRepo.update({
        id: request.id,
        fileId: fileResult.value.id.toString(),
      } as ModificationRequest)

      if (res.is_err()) {
        console.log('modificationRequestRepo.update failed', res.unwrap_err())
        continue
      }

      updatedProjects.push(request.id)
    }

    console.log('\nUpdated', updatedProjects.length, 'modification requests')

    // For each:
    // look for file in file system
    // if found, call FileService to copy that file over there
    // set garantiesFinancieresFileId
  })
  .then(() => {
    console.log('Demandes de modification mises à jour')

    process.exit(0)
  })
  .catch((err) => {
    console.log('Caught error', err)
    process.exit(1)
  })
