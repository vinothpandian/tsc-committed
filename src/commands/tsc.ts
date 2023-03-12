import { execa, ExecaError } from "execa";
import { split } from "lodash-es";
import { logSuccess } from "../utils";

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
