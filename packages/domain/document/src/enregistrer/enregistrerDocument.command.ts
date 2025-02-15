import { Message, MessageHandler, mediator } from 'mediateur';
import { DocumentProjet } from '..';

export type EnregistrerDocumentProjetCommand = Message<
  'ENREGISTRER_DOCUMENT_PROJET_COMMAND',
  {
    documentProjet: DocumentProjet.ValueType;
    content: ReadableStream;
  }
>;

export type EnregistrerDocumentProjetPort = (key: string, content: ReadableStream) => Promise<void>;

export type EnregistrerDocumentProjetDependencies = {
  enregistrerDocumentProjet: EnregistrerDocumentProjetPort;
};

export const registerEnregistrerDocumentCommand = ({
  enregistrerDocumentProjet,
}: EnregistrerDocumentProjetDependencies) => {
  const handler: MessageHandler<EnregistrerDocumentProjetCommand> = ({ documentProjet, content }) =>
    enregistrerDocumentProjet(documentProjet.formatter(), content);
  mediator.register('ENREGISTRER_DOCUMENT_PROJET_COMMAND', handler);
};
