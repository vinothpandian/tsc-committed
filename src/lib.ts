import { forEach, intersection, isEmpty, size } from "lodash-es";
import process from "process";
import {
  spinnerError,
  spinnerSuccess,
  updateSpinnerText,
} from "./utils/spinner";
import { getFilteredFiles, logError, logInfo, logSuccess } from "./utils";
import { getModifiedFilesListFromGit, getTscErrorFiles } from "./commands";

interface TscCommittedArgs {
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
}: Required<TscCommittedArgs>) {
  const gitFiles = await getModifiedFilesListFromGit(
    baseBranch,
    projectDir,
    debug
  );
  if (debug) {
    logInfo(`Found ${size(gitFiles)} modified files from git before filtering`);
  }

  return getFilteredFiles(gitFiles, rootDir, extensions, "git");
}

async function getFilesFromTsc({
  rootDir,
  extensions,
  projectDir,
  debug,
}: Required<Omit<TscCommittedArgs, "baseBranch">>) {
  const tscFiles = await getTscErrorFiles(projectDir, debug);

  if (debug) {
    logInfo(
      `Found ${size(tscFiles)} files with errors from tsc before filtering`
    );
  }

  return getFilteredFiles(tscFiles, rootDir, extensions, "tsc");
}

export async function tscCommitted({
  baseBranch = "main",
  rootDir = "src",
  extensions = ["ts", "tsx"],
  projectDir: dir,
  debug = false,
}: TscCommittedArgs) {
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
  const committedFiles = await getFilesFromGit({
    baseBranch,
    rootDir,
    extensions,
    projectDir,
    debug,
  });
  spinnerSuccess(
    `Found ${size(committedFiles)} modified files from ${baseBranch} branch`
  );

  const modifiedFilesWithError = intersection(committedFiles, filteredTscFiles);

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
