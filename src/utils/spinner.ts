import ora from "ora";

const spinner = ora({
  // make a singleton, so we don't ever have 2 spinners
  spinner: "dots2",
});

export const updateSpinnerText = (message: string) => {
  if (spinner.isSpinning) {
    spinner.text = message;
    return;
  }
  spinner.start(message);
};

export const spinnerError = (message?: string) => {
  if (spinner.isSpinning) {
    spinner.fail(message);
  }
};
export const spinnerSuccess = (message?: string) => {
  if (spinner.isSpinning) {
    spinner.succeed(message);
  }
};
