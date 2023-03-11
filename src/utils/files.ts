import { filter } from "lodash-es";

export async function getFilteredFiles(
  files: string[],
  rootDir = "src",
  extensions = ["ts", "tsx"]
) {
  const extensionMatcher = new RegExp(
    `^${rootDir}.*\\.(${extensions.join("|")})$`
  );

  return filter(files, (file) => extensionMatcher.test(file));
}
