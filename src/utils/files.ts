import { compact, map, sortBy, uniq } from "lodash-es";

const composeFileMatcherRegex = (
  rootDir: string,
  extensions: string[],
  type: "git" | "tsc"
) => {
  const sortedExtensions = sortBy(extensions, (ext) => -ext.length);

  const matcher = `${rootDir}.*\\.(${sortedExtensions.join("|")})`;

  if (type === "git") {
    return new RegExp(`^.*(${matcher})$`);
  }

  return new RegExp(`^.*(${matcher})\x1B.*$`);
};

export function getFilteredFiles(
  files: string[],
  rootDir: string,
  extensions: string[],
  type: "git" | "tsc"
) {
  const matcher = composeFileMatcherRegex(rootDir, extensions, type);

  const filePaths = map(files, (line) => matcher.exec(line)?.[1] ?? null);

  return uniq(compact(filePaths));
}
