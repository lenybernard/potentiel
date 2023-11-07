import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { Abandon } from '@potentiel-domain/laureat';
import { PotentielWorld } from '../../../../potentiel.world';
import { convertStringToReadableStream } from '../../../../helpers/convertStringToReadable';
import { DateTime, IdentifiantUtilisateur } from '@potentiel-domain/common';

Quand(
  `un porteur demande l'abandon pour le projet lauréat {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, table: DataTable) {
    try {
      const exemple = table.rowsHash();
      const raison = exemple[`La raison de l'abandon`] ?? `La raison de l'abandon`;
      const format = exemple[`Le format de la pièce justificative`] ?? `text/plain`;
      const content =
        exemple[`Le contenu de la pièce justificative`] ?? `Le contenu de la pièce justificative`;
      const recandidature = exemple[`Recandidature`] === 'oui';
      const dateDemande = new Date();
      const utilisateur = 'porteur@test.test';

      this.lauréatWorld.abandonWorld.raison = raison;
      this.lauréatWorld.abandonWorld.recandidature = recandidature;
      this.lauréatWorld.abandonWorld.dateDemande = DateTime.convertirEnValueType(dateDemande);
      this.lauréatWorld.abandonWorld.pièceJustificative = {
        format,
        content,
      };
      this.lauréatWorld.abandonWorld.utilisateur =
        IdentifiantUtilisateur.convertirEnValueType(utilisateur);

      const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

      await mediator.send<Abandon.AbandonUseCase>({
        type: 'DEMANDER_ABANDON_USECASE',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          raisonValue: raison,
          pièceJustificativeValue: {
            content: convertStringToReadableStream(content),
            format,
          },
          recandidatureValue: recandidature,
          dateDemandeValue: dateDemande.toISOString(),
          utilisateurValue: utilisateur,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);
