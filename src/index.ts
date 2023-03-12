#! /usr/bin/env node
import figlet from "figlet";
import { Command } from "commander";
import { isEmpty } from "lodash-es";
import { tscCommitted } from "./lib";
import { logError, logInfo } from "./utils";

console.log(figlet.textSync("TSC Committed"));
const program = new Command("tsc-committed");

program
  .version("1.0.0")
  .description(
    "A CLI tool to report tsc errors on committed files between base branch and feature branch in a git repo"
  )
  .option(
    "-p, --projectDir <projectDir>",
    "Project directory - By default current directory",
    process.cwd()
  )
  .option("-r, --rootDir <rootDir>", "Root directory", "src")
  .option("-b, --baseBranch <baseBranch>", "Base branch", "main")
  .option("-e, --extensions <extensions>", "File extensions", "ts,tsx")
  .option("-v, --verbose", "Verbose mode", false)
  .action(
    async ({
      projectDir,
      rootDir,
      baseBranch,
      extensions: extensionsString,
      verbose: debug,
    }) => {
      const extensions = extensionsString.split(",");

      if (isEmpty(extensions)) {
        logError("Please provide a comma separated list of file extensions");
        process.exit(1);
      }

      if (debug) {
        logInfo("Debug mode enabled");

        logInfo("Arguments passed to tsc-committed:");
        console.table({
          projectDir,
          baseBranch,
          rootDir,
          extensions,
          debug,
        });
      }

      await tscCommitted({
        projectDir,
        rootDir,
        baseBranch,
        extensions,
        debug,
      });
    }
  );

program.parse(process.argv);
