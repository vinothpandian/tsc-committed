import { describe, expect, it } from "vitest";
import { getFilteredGitFiles, getFilteredTscFiles } from "../files";

describe("git", () => {
  const MODIFIED_FILES = [
    "src/utils/__tests__/files.test.ts",
    "src/utils/git.tsx",
    "index.ts",
    "package.json",
  ];

  it("getModifiedFiles only ts from src folder", async () => {
    const files = await getFilteredGitFiles(MODIFIED_FILES, "src", ["ts"]);
    expect(files).toEqual(["src/utils/__tests__/files.test.ts"]);
  });

  it("getModifiedFiles ts and tsx from src folder", async () => {
    const files = await getFilteredGitFiles(MODIFIED_FILES, "src", [
      "ts",
      "tsx",
    ]);
    expect(files).toEqual([
      "src/utils/__tests__/files.test.ts",
      "src/utils/git.tsx",
    ]);
  });

  it("getModifiedFiles with different matcher", async () => {
    const files = await getFilteredGitFiles(MODIFIED_FILES, "");
    expect(files).toEqual([
      "src/utils/__tests__/files.test.ts",
      "src/utils/git.tsx",
      "index.ts",
    ]);
  });
});

describe("tsc", () => {
  const TSC_FILES = [
    "Found 108 errors in 10 files.",
    "",
    "Errors  Files",
    "     3  app/entry.client.tsx\x1B[90m:1\x1B[0m",
    "     4  app/entry.server.tsx\x1B[90m:1\x1B[0m",
    "    15  app/root.tsx\x1B[90m:1\x1B[0m",
    "    18  app/routes/index.tsx\x1B[90m:1\x1B[0m",
    "    30  app/routes/jokes.tsx\x1B[90m:1\x1B[0m",
    "    30  app/routes/jokes.tsx\x1B[90m:1\x1B[0m",
    "     7  app/routes/jokes/$jokeId.tsx\x1B[90m:3\x1B[0m",
    "     7  app/routes/jokes/index.tsx\x1B[90m:3\x1B[0m",
    "    21  app/routes/jokes/new.tsx\x1B[90m:3\x1B[0m",
    "     1  prisma/seed.ts\x1B[90m:1\x1B[0m",
    "     2  remix.env.d.ts\x1B[90m:1\x1B[0m",
  ];

  const SINGLE_TSC_ERROR_LINES = ["src/index.ts\x1B[90m:18\x1B[0m", ""];

  it("getFilteredTscFiles", async () => {
    const files = await getFilteredTscFiles(TSC_FILES, "app", ["ts", "tsx"]);
    expect(files).toEqual([
      "app/entry.client.tsx",
      "app/entry.server.tsx",
      "app/root.tsx",
      "app/routes/index.tsx",
      "app/routes/jokes.tsx",
      "app/routes/jokes/$jokeId.tsx",
      "app/routes/jokes/index.tsx",
      "app/routes/jokes/new.tsx",
    ]);
  });

  it("getFilteredTscFiles in app folder", async () => {
    const files = await getFilteredTscFiles(TSC_FILES, "app", ["ts"]);
    expect(files).toEqual([]);
  });

  it("getFilteredTscFiles in root with only ts", async () => {
    const files = await getFilteredTscFiles(TSC_FILES, "prisma", ["ts"]);
    expect(files).toEqual(["prisma/seed.ts"]);
  });

  it("getFilteredTscFiles in single errors", async () => {
    const files = await getFilteredTscFiles(SINGLE_TSC_ERROR_LINES, "src", [
      "ts",
      "tsx",
    ]);
    expect(files).toEqual(["src/index.ts"]);
  });
});
