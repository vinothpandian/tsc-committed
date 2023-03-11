import { execa, ExecaError } from "execa";
import { compact, findLastIndex, split } from "lodash-es";
import { logError, logInfo } from "./logger";

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
