import { resetDatabase } from '../../../helpers'
import { TâcheMiseAJourDatesMiseEnServiceDémarrée } from '@modules/imports/gestionnaireRéseau'
import { Tâches } from '../tâches.model'
import onTâcheMiseAJourDatesMiseEnServiceDémarrée from './onTâcheMiseAJourDatesMiseEnServiceDémarrée'

describe('Handler onTâcheMiseAJourDatesMiseEnServiceDémarrée', () => {
  const occurredAt = new Date('2022-01-04')
  const gestionnaire = 'Enedis'

  beforeEach(async () => {
    await resetDatabase()
  })

  it(`Lorsque évènement un énement de type 'TâcheMiseAJourDatesMiseEnServiceDémarrée' survient
      Alors une nouvelle tâche 'en cours' de mise a jour de date de mise en service devrait être créée avec :
        - le gestionnaire 
        - la date de début`, async () => {
    await onTâcheMiseAJourDatesMiseEnServiceDémarrée(
      new TâcheMiseAJourDatesMiseEnServiceDémarrée({
        payload: {
          misAJourPar: 'misAJourPar-id',
          gestionnaire,
          dates: [],
        },
        original: {
          version: 1,
          occurredAt,
        },
      })
    )

    const tâche = await Tâches.findOne({
      where: {
        gestionnaire,
        type: 'maj-date-mise-en-service',
        état: 'en cours',
        dateDeDébut: occurredAt,
      },
    })

    expect(tâche).not.toBeNull()
    expect(tâche).toMatchObject({
      id: expect.any(Number),
      gestionnaire,
      état: 'en cours',
      type: 'maj-date-mise-en-service',
      dateDeDébut: occurredAt,
    })
  })
})
