import { JsonFile, awscdk } from 'projen';
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  name: 'project-generation-as-code',
  projenrcTs: true,

  prettier: true,
  prettierOptions:{
    settings:{
      singleQuote:true,
    }
  }
  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});

project.buildWorkflow?.addPostBuildJobCommands('postBuild', ['echo "This is a post build job"']);

new JsonFile(project, "hands-on.json", {
  obj: {
    'hello': 'world'
  }
});

project.synth();