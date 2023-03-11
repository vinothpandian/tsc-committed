import {defineConfig, Options} from 'tsup'

export default defineConfig((options: Options) => {
    return {

        minify: !options.watch,
        onSuccess: "node ./dist/index.js",
        entry: ["./src/index.ts"],
        silent: true
        
    }
})