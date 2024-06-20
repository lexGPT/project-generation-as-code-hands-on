import { cdk } from 'projen';
const project = new cdk.JsiiProject({
  author: 'Lex Felix',
  authorAddress: '112618115+lexfelixpost@users.noreply.github.com',
  defaultReleaseBranch: 'main',
  jsiiVersion: '~5.4.0',
  name: 'projen-extension',
  projenrcTs: true,
  repositoryUrl: 'git@github.com:lexGPT/project-generation-as-code-hands-on.git',

  deps: ['constructs'],
  peerDeps: ['constructs', 'projen'],

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();