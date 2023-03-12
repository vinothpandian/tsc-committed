import { execa, ExecaError } from "execa";
import { compact, split } from "lodash-es";
import { logError, logInfo } from "../utils";
import { stopSpinner } from "../utils/spinner";

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
    stopSpinner();
    const { stderr, shortMessage } = e as ExecaError;

    console.log(stderr);

    // Verify git is installed
    if (stderr.includes("git: command not found")) {
      stopSpinner();
      logError("Git is not installed. Please install git.");
      process.exit(1);
    }

    // Verify if it is a git repository
    if (stderr.includes("Not a git repository")) {
      stopSpinner();
      logError(
        "Not a git repository. Please run the command in a git repository."
      );
      process.exit(1);
    }

    // Verify base branch exists
    if (stderr.includes("fatal: ambiguous argument")) {
      stopSpinner();
      logError(`Base branch ${baseBranch} not found. Check your git config.`);
      process.exit(1);
    }

    logError(shortMessage);
    logInfo("Check if you are in the correct directory");
  }

  return [];
}
