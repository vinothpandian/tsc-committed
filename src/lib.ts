import { forEach, intersection, isEmpty, size } from "lodash-es";
import process from "process";
import {
  spinnerError,
  spinnerSuccess,
  updateSpinnerText,
} from "./utils/spinner";
import {
  getFilteredGitFiles,
  getFilteredTscFiles,
  logError,
  logInfo,
  logSuccess,
} from "./utils";
import { getModifiedFilesListFromGit, getTscErrorFiles } from "./commands";

interface TscStagedArgs {
  baseBranch?: string;
  rootDir?: string;
  extensions?: string[];
  projectDir?: string;

  debug?: boolean;
}

async function getFilesFromGit({
  baseBranch,
  rootDir,
  extensions,
  projectDir,
  debug,
}: Required<TscStagedArgs>) {
  const gitFiles = await getModifiedFilesListFromGit(
    baseBranch,
    projectDir,
    debug
  );
  if (debug) {
    logInfo(`Found ${size(gitFiles)} modified files from git before filtering`);
  }

  return getFilteredGitFiles(gitFiles, rootDir, extensions);
}

async function getFilesFromTsc({
  rootDir,
  extensions,
  projectDir,
  debug,
}: Required<Omit<TscStagedArgs, "baseBranch">>) {
  const tscFiles = await getTscErrorFiles(projectDir, debug);

  if (debug) {
    logInfo(
      `Found ${size(tscFiles)} files with errors from tsc before filtering`
    );
  }

  return getFilteredTscFiles(tscFiles, rootDir, extensions);
}

export async function tscStaged({
  baseBranch = "main",
  rootDir = "src",
  extensions = ["ts", "tsx"],
  projectDir: dir,
  debug = false,
}: TscStagedArgs) {
  const projectDir = dir || process.cwd();

  updateSpinnerText("Compiling Typescript files...");
  const filteredTscFiles = await getFilesFromTsc({
    rootDir,
    extensions,
    projectDir,
    debug,
  });

  if (isEmpty(filteredTscFiles)) {
    spinnerSuccess("No Typescript errors found!");
    return;
  }
  spinnerError(`Found ${size(filteredTscFiles)} files with Typescript errors`);

  updateSpinnerText(`Getting modified files from ${baseBranch} branch...`);
  const stagedFiles = await getFilesFromGit({
    baseBranch,
    rootDir,
    extensions,
    projectDir,
    debug,
  });
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
