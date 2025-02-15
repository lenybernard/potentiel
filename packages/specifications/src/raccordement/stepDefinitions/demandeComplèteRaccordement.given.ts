import { Given as EtantDonné, DataTable } from '@cucumber/cucumber';
import { PotentielWorld } from '../../potentiel.world';
import {
  convertirEnDateTime,
  DomainUseCase,
  convertirEnIdentifiantProjet,
  convertirEnIdentifiantGestionnaireRéseau,
  convertirEnRéférenceDossierRaccordement,
  IdentifiantProjet,
} from '@potentiel/domain-usecases';
import { mediator } from 'mediateur';
import { convertStringToReadableStream } from '../../helpers/convertStringToReadable';

type DemandeComplèteRaccordement = {
  identifiantProjet: IdentifiantProjet;
  raisonSociale: string;
  dateQualification: string | Date;
  référenceDossierRaccordement: string;
  format: string;
  content: string;
};

const demandeComplèteRaccordementParDéfaut: Omit<
  DemandeComplèteRaccordement,
  'raisonSociale' | 'identifiantProjet'
> = {
  dateQualification: new Date(),
  référenceDossierRaccordement: 'REF_DOSSIER',
  format: 'application/pdf',
  content: `Accusé de réception ayant pour référence REF_DOSSIER et la date de qualification au ${new Date().toISOString()}`,
};

EtantDonné(
  'une demande complète de raccordement transmise auprès du gestionnaire de réseau {string} pour le projet {string}',
  async function (
    this: PotentielWorld,
    raisonSocialeGestionnaireRéseau: string,
    nomProjet: string,
  ) {
    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);
    const { codeEIC } = this.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(
      raisonSocialeGestionnaireRéseau,
    );

    const { référenceDossierRaccordement, format, content } = demandeComplèteRaccordementParDéfaut;
    const dateQualification = convertirEnDateTime(
      demandeComplèteRaccordementParDéfaut.dateQualification,
    );

    const accuséRéception = {
      format,
      content: convertStringToReadableStream(content),
    };

    this.raccordementWorld.dateQualification = dateQualification;
    this.raccordementWorld.référenceDossierRaccordement = référenceDossierRaccordement;
    this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement = {
      format,
      content,
    };

    await mediator.send<DomainUseCase>({
      type: 'TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
      data: {
        identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
        identifiantGestionnaireRéseau: convertirEnIdentifiantGestionnaireRéseau(codeEIC),
        référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement(
          référenceDossierRaccordement,
        ),
        dateQualification,
        accuséRéception,
      },
    });
  },
);

EtantDonné(
  'un projet avec une demande complète de raccordement transmise auprès du gestionnaire de réseau {string} avec :',
  async function (this: PotentielWorld, raisonSociale, table: DataTable) {
    const exemple = table.rowsHash();
    const dateQualification = convertirEnDateTime(exemple['La date de qualification']);
    const référenceDossierRaccordement = exemple['La référence du dossier de raccordement'];
    const format = exemple[`Le format de l'accusé de réception`];
    const content = exemple[`Le contenu de l'accusé de réception`];

    const accuséRéception = {
      format,
      content: convertStringToReadableStream(content),
    };

    const { codeEIC } =
      this.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(raisonSociale);

    this.raccordementWorld.dateQualification = dateQualification;
    this.raccordementWorld.référenceDossierRaccordement = référenceDossierRaccordement;
    this.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement = {
      format,
      content,
    };

    await mediator.send<DomainUseCase>({
      type: 'TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
      data: {
        identifiantProjet: convertirEnIdentifiantProjet(this.lauréatWorld.identifiantProjet),
        identifiantGestionnaireRéseau: convertirEnIdentifiantGestionnaireRéseau(codeEIC),
        référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement(
          référenceDossierRaccordement,
        ),
        dateQualification,
        accuséRéception,
      },
    });
  },
);

EtantDonné(
  'une date de mise en service {string} pour le dossier de raccordement {string}',
  async function (this: PotentielWorld, dateMiseEnService, référenceDossierRaccordement) {
    const dateMiseEnServiceValueType = convertirEnDateTime(dateMiseEnService);

    this.raccordementWorld.dateMiseEnService = dateMiseEnServiceValueType;
    this.raccordementWorld.référenceDossierRaccordement = référenceDossierRaccordement;

    try {
      await mediator.send<DomainUseCase>({
        type: 'TRANSMETTRE_DATE_MISE_EN_SERVICE_USECASE',
        data: {
          identifiantProjet: convertirEnIdentifiantProjet(this.lauréatWorld.identifiantProjet),
          référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement(
            référenceDossierRaccordement,
          ),
          dateMiseEnService: dateMiseEnServiceValueType,
          dateDésignation: convertirEnDateTime(new Date('2020-01-01')),
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);
