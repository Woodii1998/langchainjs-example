import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { CustomMarkdownLoader } from '../utils/customPDFLoader';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';

const filePath = 'docs';

export const run = async () => {
  try {
    const directoryLoader = new DirectoryLoader(filePath, {
      '.pdf': (path) => new PDFLoader(path),
      '.md': (path) => new CustomMarkdownLoader(path),
    });

    const rawDocs = await directoryLoader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await textSplitter.splitDocuments(rawDocs);

    console.log('doc:', docs[50].pageContent);
    console.log('lines:', docs[50].metadata.loc);
  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to ingest your data');
  }
};

(async () => {
  await run();
  console.log('split');
})();
