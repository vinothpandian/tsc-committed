import { execa } from "execa";
import { split } from "lodash-es";
import { logError, logInfo } from "../utils";

export async function getTscErrorFiles(projectDir?: string, debug = false) {
  const cwd = projectDir || process.cwd();

  try {
    await execa("tsc", ["--pretty", "--noEmit"], {
      cwd,
    });

    return [];
  } catch (e) {
    // TSC errors are printed to stdout as it is a pretty command
    const { stdout, code } = e as { stdout: string; code: string };

    if (code === "ENOENT") {
      logError("tsc command not found. Run in a project with TypeScript.");
      process.exit(1);
    }

    if (debug) {
      logInfo("\ntsc --pretty --noEmit");
      logError(`${stdout}\n`);
    }

    const errorsFoundLine = /Found \d+ errors? in (.*)/s;

    const match = stdout.match(errorsFoundLine);
    const matchedLines = match?.[1] ?? "";

    return split(matchedLines, "\n");
  }
}
