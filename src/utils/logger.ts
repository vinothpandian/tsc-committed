import chalk from "chalk";
import { stopSpinner } from "./spinner";

const { log } = console;

export function logError(message: string) {
  stopSpinner();
  log(chalk.red(message));
}

export function logInfo(message: string) {
  stopSpinner();
  log(chalk.blue(message));
}

export function logSuccess(message: string) {
  stopSpinner();
  log(chalk.green(message));
}

export function logTitle(message: string) {
  log(chalk.yellow(message));
}
