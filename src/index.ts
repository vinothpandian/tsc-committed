import { execa } from "execa";

export async function main() {
  const { stdout } = await execa("echo", ["unicorns"]);
  console.log(stdout);
}
