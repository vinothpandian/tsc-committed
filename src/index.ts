#! /usr/bin/env node
import figlet from "figlet";
import { forEach, intersection, isEmpty, size } from "lodash-es";
import * as process from "process";
import { getModifiedFilesListFromGit, getTscErrorFiles } from "./commands";
import {
  getFilteredGitFiles,
  getFilteredTscFiles,
  logError,
  logInfo,
  logSuccess,
} from "./utils";
import {
  spinnerError,
  spinnerSuccess,
  updateSpinnerText,
} from "./utils/spinner";

async function getFilesFromGit(
  baseBranch: string,
  projectDir: string,
  rootDir: string,
  extensions: string[]
) {
  const gitFiles = await getModifiedFilesListFromGit(baseBranch, projectDir);
  return getFilteredGitFiles(gitFiles, rootDir, extensions);
}
async function getFilesFromTsc(
  projectDir: string,
  rootDir: string,
  extensions: string[]
) {
  const tscFiles = await getTscErrorFiles(projectDir);
  return getFilteredTscFiles(tscFiles, rootDir, extensions);
}

async function main() {
  const projectDir = "/Users/vinoth/Projects/remix-jokes";
  const rootDir = "app";
  const extensions = ["ts", "tsx"];
  const baseBranch = "main";

  updateSpinnerText("Compiling Typescript files...");
  const filteredTscFiles = await getFilesFromTsc(
    projectDir,
    rootDir,
    extensions
  );

  if (isEmpty(filteredTscFiles)) {
    spinnerSuccess("No Typescript errors found!");
    return;
  }
  spinnerError(`Found ${size(filteredTscFiles)} files with Typescript errors`);

  updateSpinnerText(`Getting modified files from ${baseBranch} branch...`);
  const stagedFiles = await getFilesFromGit(
    baseBranch,
    projectDir,
    rootDir,
    extensions
  );
  spinnerSuccess(
    `Found ${size(stagedFiles)} modified files from ${baseBranch} branch`
  );

  const modifiedFilesWithError = intersection(stagedFiles, filteredTscFiles);

  if (isEmpty(modifiedFilesWithError)) {
    logSuccess("No modified files with Typescript errors found!");
    return;
  }

  const modifiedFilesWithErrorCount = size(modifiedFilesWithError);
  logError(
    `Found ${modifiedFilesWithErrorCount} modified files with Typescript errors`
  );

  forEach(modifiedFilesWithError, (file) => {
    logInfo(file);
  });

  process.exit(1);
}

figlet("TSC Staged", (err, data) => {
  if (err) {
    console.log("Something went wrong...");
    console.dir(err);
    return;
  }

  console.log(data);
});

main();

console.log("\n");
