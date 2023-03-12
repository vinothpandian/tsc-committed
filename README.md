# TSC Committed
---

TSC Committed is a CLI tool that helps identify the committed files between a base branch and a feature branch that fail the TypeScript compilation on committed files in a Git repository. 

The tool is designed to be used in a continuous integration/continuous deployment (CI/CD) environment or as a Git hook to ensure that only TypeScript files that compiled successfully are committed to the codebase.

## Installation

To install TSC Committed, run the following command:

```bash
npm install -g tsc-committed
```

or using npx:

```bash
npx tsc-committed
```

## Usage
TSC Committed can be used as a command-line tool by passing in the project directory, root directory, file extensions
and the base branch and feature branch to compare. The tool will output the list of files TypeScript compilation errors found on the
committed files.

```bash
tsc-committed --projectDir path/to/project --rootDir src --extensions ts,tsx --baseBranch main
```

## Options
The following options are available:

* --projectDir: The project directory to run tsc against. Default is the current directory.
* --rootDir: The root directory for TypeScript files. Default is "src".
* --extensions: The file extensions to include. Default is "ts,tsx".
* --baseBranch: The base branch to compare with. Default is main.
* --verbose: Enables verbose output.

## Using as a Git Hook
To use TSC Committed as a Git hook, add the following to your `.git/hooks/pre-commit` file:

```bash
#!/bin/sh

tsc-committed --baseBranch main  || exit 1
```

Make sure the pre-commit file is executable:

bash
Copy code
```bash
chmod +x .git/hooks/pre-commit
```

## Contributing

If you would like to contribute to TSC Committed, please follow the steps below:

* Fork the repository.
* Create a new branch for your feature or bug fix.
* Make your changes and write tests for them.
* Run the tests to ensure they pass.
* Commit your changes and push your branch to your fork.
* Create a pull request to the main branch of the `vinothpandian/tsc-committed` repository.


## License
TSC Committed is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more information.
