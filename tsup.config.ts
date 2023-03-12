import { defineConfig, Options } from "tsup";

export default defineConfig((options: Options) => {
  return {
    minify: !options.watch,
    onSuccess: options.watch ? "node ./dist/index.js" : undefined,
    entry: ["./src/index.ts"],
    silent: Boolean(options.watch),
  };
});
