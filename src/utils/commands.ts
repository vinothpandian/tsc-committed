import { execa, ExecaError } from "execa";
import { compact, split } from "lodash-es";
import { logError, logInfo, logSuccess } from "./logger";

export async function getModifiedFilesListFromGit(
  baseBranch: string
): Promise<string[]> {
  try {
    const { stdout } = await execa("git", ["diff", "--name-only", baseBranch]);

    return compact(split(stdout, "\n"));
  } catch (e) {
    const error = e as ExecaError;
    logError(error.shortMessage);
    logInfo("Check if you are in the correct directory");
  }

  return [];
}

export async function getTscErrorFiles() {
  try {
    await execa("tsc", ["--pretty"]);

    // If no errors are found, the command won't throw an error
    logSuccess("No typescript errors found.");
    return [];
  } catch (e) {
    // TSC errors are printed to stdout as it is a pretty command
    const { stdout } = e as ExecaError;

    const errorsFoundLine = /Found \d+ errors? in (.*)/s;

    const match = stdout.match(errorsFoundLine);
    const matchedLines = match?.[1] ?? "";

    return split(matchedLines, "\n");
  }
}
