# Project Generation as Code: Hands-On Workshop

Hello and welcome to this hands-on workshop! In this workshop, you will learn how to get started with Projen, explore different ways to use it, and understand how to create your own project types to streamline changes to default Projen project types.

Each part of the workshop includes branch checkpoints. If you get stuck or want to skip ahead, you can check out the respective branch to continue from that part.

Before you get started, please read through [this section](https://projen.io/docs/concepts/components#projects--components) of the Projen documentation to understand projects and components in Projen.

> **Note:** This workshop focuses on using Projen in a TypeScript environment. While Projen supports other languages, for this hands-on, you will need basic knowledge of TypeScript and NodeJS (version 18 or later) to use `npx` and the `Projen` package from the public npm registry.

## Part 1: Creating a Project

To start creating a project, run `npx projen new` in your terminal. This command lists all available options, including default project types included in Projen.

> You can include configuration options right from the start by supplying them as options in the command (e.g., `--name my-custom-name` to override the default name property before initial generation).

> Projen supports project types for various languages. You can create projects in these languages using the `npx projen new` command and continue working in that language.

For this hands-on, let's create an AWS CDK TypeScript app by running:

```sh
npx projen new awscdk-app-ts
```

After initiating the command, Projen will populate your directory with all the necessary files. You will likely recognize many of them as they are used in tools you are already familiar with. One file you may not recognize is the `.projenrc.ts` file, which you will use to further configure the project in the next part.

## Part 2: Configuring the Project

Before configuring your project, understand the structure of the `.projenrc.ts` file. As the extension implies, it's a TypeScript file with imports at the top and code below. The critical part of the code is initializing a Project class and then calling the `synth` method on that object. You can interact with the supposed state of your project using code before calling `synth`.

You can interact with the project in multiple ways:

- Altering the configuration values provided to the constructor of the project.
- Using variables and/or methods on the project object.
- Adding your own components to the project.

### Altering the Configuration Values

You can change configuration values using standard TypeScript syntax. To find out what configuration options are available, refer to the [Projen documentation](https://projen.io/docs/api/awscdk#awscdktypescriptapp-), use auto-complete, or cmd/ctrl + click to view the type definitions.

Let's enable [Prettier](https://prettier.io/) to help format our code. Add `prettier: true,` on line 6, below `projenrcTs: true,`. After making the change, run `npx projen` to apply the changes.

You will see the following files generated:

- `.prettierrc.json`
- `.prettierignore`

And the following files altered:

- `package.json` to add Prettier as a development dependency
- `eslintrc.json` to make it compatible with Prettier
- `.gitignore` to include the Prettier files

Enabling Prettier will not override any default configurations. You can supply `prettierOptions` to customize Prettier settings. For example, adding `settings: { singleQuote: true }` under `prettierOptions` will add the `singleQuote: true` value to `.prettierrc.json`.

This example shows a small configuration change. For more significant examples, such as configuring the `buildWorkflow` and `buildWorkflowOptions` options, Projen can help you even more by generating a standardized GitHub Actions compatible build workflow, which you can customize.

### Using Variables and/or Methods

Using variables and methods is similar to altering configuration values. Refer to the [Projen documentation](https://projen.io/docs/api/awscdk#awscdktypescriptapp-), use auto-complete, or cmd/ctrl + click to view type definitions.

Let's alter the Build Workflow to execute some logic after building. Add the following code just before the `project.synth()` line and run `npx projen`:

```ts
project.buildWorkflow?.addPostBuildJobCommands('postBuild', ['echo "This is a post build job"']);
```

If you check the workflow file (`.github/workflows/build.yml`), you will see a new job at the bottom called `postBuild`. The method not only added the job with the specified command but also handled boilerplate tasks like adding the `needs` attribute on the build job and initial steps to set up the job before running the commands.

Variables and methods are mainly used to change the tooling with a low-level API, allowing for changes not initially anticipated. If even low-level APIs are unavailable, you can use built-in [escape hatches](https://projen.io/docs/concepts/escape-hatches) to alter the files.

### Adding Your Own Components

Components are self-contained project features and building blocks composed into projects. These components can be added by project builders or by yourself.

Let's add a component to create a JSON file called `hands-on.json`. Add the following code before the `project.synth()` line and add the `JsonFile` import from `projen` at the top:

```ts
new JsonFile(project, "hands-on.json", {
  obj: {
    'hello': 'world'
  }
});
```

After running `npx projen`, you will see the file `hands-on.json` with the specified contents. To generate a YAML file instead, change `JsonFile` to `YamlFile` and update the file name to `hands-on.yml`. The contents will be the same, but the format will be YAML.

Components are versatile and can create multiple sub-components, providing a nice developer experience by abstracting file creation.

## Part 3: Creating a Custom Project

After making several configuration changes or adding multiple components, you might want to create a new project type to reuse your setup across multiple projects. Projen supports this out of the box, and you can do it locally.

Create a new folder called `projen-extension` (or another name of your choice). In your terminal, `cd` into that folder and create a jsii project using:

```sh
npx projen new jsii
```

This command creates a new jsii project, which we need to set up as a Projen-compatible package:

- Add the `constructs` package as a dependency.
- Add the `constructs` and `projen` packages as peer dependencies.
- Update the `index.ts` file in the `src` folder to hold a Projen project class.

To create a custom `AwsCdkTypeScriptApp`, use the following code:

```ts
import { awscdk } from "projen";

export interface CustomAwsCdkTypeScriptAppOptions extends awscdk.AwsCdkTypeScriptAppOptions {}

/**
 * This will identify the project type for use in npx projen new
 * @pjid custom-aws-cdk-typescript-app
 */
export class CustomAwsCdkTypeScriptApp extends awscdk.AwsCdkTypeScriptApp {
  constructor(options: CustomAwsCdkTypeScriptAppOptions) {
    super(options);
  }
}
```

Now, you have the basic structure and can use this locally instead of the default Projen setup. You can modify the existing project class and import from `awscdk.AwsCdkTypeScriptApp` to `CustomAwsCdkTypeScriptApp`.

To use this custom project with `npx projen new`, you can use the `--from` option with the CLI. This option supports any value that you can provide to [yarn add](https://classic.yarnpkg.com/en/docs/cli/add#toc-adding-dependencies). For this workshop, we'll use path referencing to install the `projen-extension` dependency. Though this method is not recommended outside of testing, it is faster than releasing it to npm.

Let's initialize a new project called `new-project` using the `custom-aws-cdk-typescript-app` project type. First, build the `projen-extension` by running `npx projen build` or `yarn build` inside the folder. Then, create a new folder in the root project directory called `new-project` and run the following command inside the folder:

```sh
npx projen new custom-aws-cdk-typescript-app --from file:../projen-extension/
```

You will see that Projen uses the `projen-extension` code in its `.projenrc.ts`. Since we didn't change anything, it's exactly the same as the first project we built. You can now add any options you overwrote in the first project to the `projen-extension` code. After altering the `projen-extension` code, build it again and run `yarn upgrade` in `new-project` to update the dependency before running `npx projen`.
