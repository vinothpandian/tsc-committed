import { execa, ExecaError } from "execa";
import { split } from "lodash-es";

export async function getTscErrorFiles(projectDir?: string) {
  const cwd = projectDir || process.cwd();

  try {
    await execa("tsc", ["--pretty"], {
      cwd,
    });

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
