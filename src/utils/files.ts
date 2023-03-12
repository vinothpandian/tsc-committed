import { compact, filter, map, sortBy, uniq } from "lodash-es";

const composeFileMatcherRegex = (rootDir: string, extensions: string[]) => {
  const sortedExtensions = sortBy(extensions, (ext) => -ext.length);

  return `${rootDir}.*\\.(${sortedExtensions.join("|")})`;
};

export function getFilteredGitFiles(
  files: string[],
  rootDir = "src",
  extensions = ["ts", "tsx"]
) {
  const matcher = composeFileMatcherRegex(rootDir, extensions);
  const regExp = new RegExp(`^${matcher}$`);
  const filePaths = filter(files, (file) => regExp.test(file));
  return uniq(compact(filePaths));
}

export function getFilteredTscFiles(
  files: string[],
  rootDir = "src",
  extensions = ["ts", "tsx"]
) {
  const matcher = composeFileMatcherRegex(rootDir, extensions);

  const extensionMatcher = new RegExp(`^.*(${matcher})\x1B.*$`, "i");

  const filePaths = map(
    files,
    (line) => extensionMatcher.exec(line)?.[1] ?? null
  );

  return uniq(compact(filePaths));
}
