'use strict'

import models from '../models'

const { EventStore, Project } = models

import { Op, QueryInterface } from 'sequelize'

module.exports = {
  async up(queryInterface: QueryInterface) {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      const projetsÀMigrer = await Project.findAll({}, { transaction })

      console.log(`${projetsÀMigrer.length} projets à migrer`)

      const importsEvents = await EventStore.findAll(
        {
          where: {
            type: {
              [Op.in]: [
                'ProjectImported',
                'ProjectReimported',
                'LegacyProjectSourced',
                'ProjectDataCorrected',
              ],
            },
          },
          order: [['occurredAt', 'DESC']],
        },
        { transaction }
      )

      const evaluationCarboneDeRéférenceMap = importsEvents.reduce((acc, event) => {
        const projetId = event.aggregateId[0]
        return {
          ...acc,
          [projetId]:
            acc[projetId] ??
            event.payload?.data?.evaluationCarbone ??
            event.payload?.content?.evaluationCarbone ??
            event.payload?.correctedData?.evaluationCarbone,
        }
      }, {})

      await Project.bulkCreate(
        projetsÀMigrer.map((projet) => ({
          ...projet.get(),
          evaluationCarboneDeRéférence: evaluationCarboneDeRéférenceMap[projet.id],
        })),
        { updateOnDuplicate: ['evaluationCarboneDeRéférence'], transaction }
      )

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  async down(queryInterface) {},
}
