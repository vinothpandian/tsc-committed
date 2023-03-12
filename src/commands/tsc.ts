import { execa, ExecaError } from "execa";
import { split } from "lodash-es";
import { logInfo } from "../utils";

export async function getTscErrorFiles(projectDir?: string, debug = false) {
  const cwd = projectDir || process.cwd();

  try {
    await execa("tsc", ["--pretty"], {
      cwd,
    });

    return [];
  } catch (e) {
    // TSC errors are printed to stdout as it is a pretty command
    const { stdout } = e as ExecaError;

    if (debug) {
      logInfo("\ntsc --pretty");
      console.log(stdout, "\n");
    }

    const errorsFoundLine = /Found \d+ errors? in (.*)/s;

    const match = stdout.match(errorsFoundLine);
    const matchedLines = match?.[1] ?? "";

    return split(matchedLines, "\n");
  }
}
