import chalk from "chalk";

const { log } = console;

export function logError(message: string) {
  log(chalk.red(message));
}

export function logInfo(message: string) {
  log(chalk.blue(message));
}

export function logSuccess(message: string) {
  log(chalk.green(message));
}
