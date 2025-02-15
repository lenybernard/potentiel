import React from 'react';
import { User } from '../../../../entities';
import { ProjectDataForProjectPage } from '../../../../modules/project/queries';
import { Badge, Heading1 } from '../../../components';
import { ProjectActions } from './ProjectActions';

type ProjectHeaderProps = {
  project: ProjectDataForProjectPage;
  user: User;
};

export const ProjectHeader = ({ project, user }: ProjectHeaderProps) => (
  <div className="w-full pt-3 md:pt-0 print:pt-0 lg:flex justify-between gap-2">
    <div className="pl-3 print:pl-0 mb-3 text-sm">
      <div
        className="flex justify-start items-center
      "
      >
        <Heading1 className="mb-0 pb-0 flex justify-start gap-4">
          <span className="inline-block leading-10">{project.nomProjet}</span>
          {!project.notifiedOn ? (
            <Badge type="info">Non-notifié</Badge>
          ) : project.isAbandoned ? (
            <Badge type="warning">Abandonné</Badge>
          ) : project.isClasse ? (
            <Badge type="success">Classé</Badge>
          ) : (
            <Badge type="error">Éliminé</Badge>
          )}
        </Heading1>
      </div>
      <div className="font-medium mt-3">
        {project.communeProjet}, {project.departementProjet}, {project.regionProjet}
      </div>
      <div>{project.potentielIdentifier}</div>
      <div className="hidden print:block">
        Instruction selon le cahier des charges{' '}
        {project.cahierDesChargesActuel.type === 'initial'
          ? 'initial (en vigueur à la candidature)'
          : `${
              project.cahierDesChargesActuel.alternatif ? 'alternatif' : ''
            } modifié rétroactivement et publié le ${project.cahierDesChargesActuel.paruLe}`}
      </div>
    </div>

    <div className="px-3">
      <ProjectActions {...{ project, user }} />
    </div>
  </div>
);
