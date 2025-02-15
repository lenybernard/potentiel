import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Readable } from 'stream';
import { DomainEvent, Repository, UniqueEntityID } from '../../../core/domain';
import { okAsync } from '../../../core/utils';
import { makeUser } from '../../../entities';
import { FileObject } from '../../file';
import { InfraNotAvailableError, UnauthorizedError } from '../../shared';
import { UnwrapForTest } from '../../../types';
import makeFakeUser from '../../../__tests__/fixtures/user';
import { makeUploadGF } from './uploadGF';
import { fakeTransactionalRepo, makeFakeProject } from '../../../__tests__/fixtures/aggregates';
import { Project } from '../Project';

const projectId = new UniqueEntityID().toString();

const fakeFileContents = {
  filename: 'fakeFile.pdf',
  contents: Readable.from('test-content'),
};

const fakePublish = jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null));

const fakeProject = makeFakeProject();

const projectRepo = fakeTransactionalRepo(fakeProject as Project);

describe('Uploader une garantie financière', () => {
  beforeEach(() => {
    fakePublish.mockClear();
  });

  describe(`Upload impossible si l'utilisateur n'a pas les droits sur le projet`, () => {
    it(`Étant donné un utilisateur n'ayant pas accès au projet
          Lorsqu'il upload une garantie financière
          Alors une erreur UnauthorizedError devrait être retournée`, async () => {
      const user = UnwrapForTest(makeUser(makeFakeUser()));

      const shouldUserAccessProject = jest.fn(async () => false);

      const fileRepo = {
        save: jest.fn<Repository<FileObject>['save']>(),
        load: jest.fn<Repository<FileObject>['load']>(),
      };

      const uploadGF = makeUploadGF({
        fileRepo,
        shouldUserAccessProject,
        projectRepo,
      });

      const res = await uploadGF({
        file: fakeFileContents,
        stepDate: new Date(123),
        projectId,
        submittedBy: user,
        expirationDate: new Date(456),
      });

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError);

      expect(fakePublish).not.toHaveBeenCalled();
    });
  });

  describe(`Upload possible si l'utilisateur a les droits sur le projet`, () => {
    const shouldUserAccessProject = jest.fn(async () => true);

    describe(`Étant donné un utilisateur ayant accès au projet
          Lorsqu'il upload une garantie financière`, () => {
      const user = UnwrapForTest(makeUser(makeFakeUser()));
      const fileRepo = {
        save: jest.fn((file: FileObject) => okAsync(null)),
        load: jest.fn(),
      };
      const gfDate = new Date(123);
      const expirationDate = new Date(456);

      it(`Alors l'utilisateur devrait être autorisé à uploader`, async () => {
        const uploadGF = makeUploadGF({
          fileRepo: fileRepo as Repository<FileObject>,
          shouldUserAccessProject,
          projectRepo,
        });

        const res = await uploadGF({
          file: fakeFileContents,
          stepDate: gfDate,
          projectId,
          submittedBy: user,
          expirationDate,
        });

        expect(res.isOk()).toBe(true);

        expect(shouldUserAccessProject).toHaveBeenCalledWith({
          user,
          projectId,
        });
      });

      it(`Le fichier devrait être sauvegardé`, async () => {
        expect(fileRepo.save).toHaveBeenCalled();
        expect(fileRepo.save.mock.calls[0][0].contents).toEqual(fakeFileContents.contents);
      });

      it('La garantie financière devrait être ajoutée', () => {
        const fakeFile = fileRepo.save.mock.calls[0][0];
        expect(fakeProject.uploadGarantiesFinancieres).toHaveBeenCalledWith(
          gfDate,
          fakeFile.id.toString(),
          user,
          expirationDate,
        );
      });
    });
  });
});
