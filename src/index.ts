import path from 'path';
import fs from 'fs';
import execa from 'execa';
import mpdf from 'markdown-pdf';
import createGithubClient, { GithubClient } from './github';
import createFiles, { Files } from './files';
import makePdf from './pdf';

(async () => {

    const names =
    ['Basic Types',
    'Variable Declarations',
    'Interfaces',
    'Classes',
    'Functions',
    'Generics',
    'Enums',
    'Type Inference',
    'Type Compatibility',
    'Advanced Types',
    'Symbols',
    'Iterators and Generators',
    'Modules',
    'Namespaces',
    'Namespaces and Modules',
    'Module Resolution',
    'Declaration Merging',
    'JSX',
    'Decorators',
    'Mixins',
    'Triple-Slash Directives',
    'Type Checking JavaScript Files']

    const cwd = process.cwd();
    const githubClient: GithubClient = createGithubClient(execa);
    const files: Files = createFiles(fs);
    const { log } = console;

    log('Cloning handbook repo...');
    const clonedRepoDir: string =
        await githubClient.clone('Microsoft/TypeScript-Handbook', path.join(cwd, 'temp'));
    log('Done');
    const pathNames = names.map(x => path.join(clonedRepoDir, 'pages', x + '.md'));
    const markdownFiles: string[] = files.findMarkdown(path.join(clonedRepoDir, 'pages'));
    const orderedNames = pathNames.filter(x => markdownFiles.indexOf(x) >= 0);
    const remainingNames = markdownFiles.filter(x => pathNames.indexOf(x) < 0);
    const orderedMarkdownFiles = orderedNames.concat(remainingNames);
    log('Creating pdf...');
    await makePdf(mpdf().concat, orderedMarkdownFiles, path.join(cwd, 'handbook.pdf'));
    log('Done');
})();
