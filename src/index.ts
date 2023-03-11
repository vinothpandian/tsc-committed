#! /usr/bin/env node

import { execa } from "execa";

async function main() {
  const { stdout } = await execa("echo", ["unicorns"]);
  console.log(stdout);
}

main();
