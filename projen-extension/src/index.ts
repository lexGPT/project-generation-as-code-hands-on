import { JsonFile, awscdk } from 'projen';

export interface CustomAwsCdkTypeScriptAppOptions extends awscdk.AwsCdkTypeScriptAppOptions {}

/**
 * This will identify the project type for use in npx projen new
 * @pjid custom-aws-cdk-typescript-app
 */
export class CustomAwsCdkTypeScriptApp extends awscdk.AwsCdkTypeScriptApp {
  constructor(options: CustomAwsCdkTypeScriptAppOptions) {
    super({
      ...options,
      prettier: true,
      prettierOptions: {
        settings: {
          singleQuote: true,
        },
      },
    });

    this.buildWorkflow?.addPostBuildJobCommands('postBuild', ['echo "This is a post build job"']);

    new JsonFile(this, 'hands-on.json', {
      obj: {
        hello: 'world',
      },
    });
  }
}