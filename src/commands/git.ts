import { execa, ExecaError } from "execa";
import { compact, split } from "lodash-es";
import { logError, logInfo } from "../utils";

export async function getModifiedFilesListFromGit(
  baseBranch: string,
  projectDir?: string,
  debug = false
) {
  const cwd = projectDir || process.cwd();

  try {
    const { stdout } = await execa("git", ["diff", "--name-only", baseBranch], {
      cwd,
    });

    if (debug) {
      logInfo(`\ngit diff --name-only ${baseBranch}`);
      console.log(stdout, "\n");
    }

    return compact(split(stdout, "\n"));
  } catch (e) {
    const error = e as ExecaError;
    logError(error.shortMessage);
    logInfo("Check if you are in the correct directory");
  }

  return [];
}
