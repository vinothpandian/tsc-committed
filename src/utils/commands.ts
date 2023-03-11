import { execa } from "execa";
import { split } from "lodash-es";

export async function getModifiedFilesListFromGit(
  baseBranch: string
): Promise<string[]> {
  const { stdout } = await execa("git", ["diff", "--name-only", baseBranch]);

  return split(stdout, "\n");
}
