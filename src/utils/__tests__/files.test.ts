import { describe, expect, it } from "vitest";
import { getFilteredFiles } from "../files";

const MODIFIED_FILES = [
  "src/utils/__tests__/files.test.ts",
  "src/utils/git.tsx",
  "index.ts",
  "package.json",
];

describe("git", () => {
  it("getModifiedFiles only ts from src folder", async () => {
    const files = await getFilteredFiles(MODIFIED_FILES, "src", ["ts"]);
    expect(files).toEqual(["src/utils/__tests__/files.test.ts"]);
  });

  it("getModifiedFiles ts and tsx from src folder", async () => {
    const files = await getFilteredFiles(MODIFIED_FILES, "src", ["ts", "tsx"]);
    expect(files).toEqual([
      "src/utils/__tests__/files.test.ts",
      "src/utils/git.tsx",
    ]);
  });

  it("getModifiedFiles with different matcher", async () => {
    const files = await getFilteredFiles(MODIFIED_FILES, "");
    expect(files).toEqual([
      "src/utils/__tests__/files.test.ts",
      "src/utils/git.tsx",
      "index.ts",
    ]);
  });
});
