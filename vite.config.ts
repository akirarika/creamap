import { resolve } from "path";
import { cwd } from "process";
import { defineConfig, loadEnv } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig(({ command, mode }) => {
  loadEnv(mode, cwd());
  return {
    resolve: {
      dedupe: ["vue"],
    },
    build: {
      outDir: "products",
      lib: {
        // Could also be a dictionary or array of multiple entry points
        entry: resolve(__dirname, "src/main.ts"),
        name: "PurinPubsub",
        // the proper extensions will be added
        fileName: "creamap",
      },
    },
    base: "./",
    server: { port: 5173 },
    plugins: [
      dts({
        skipDiagnostics: false,
        logDiagnostics: true,
      }),
    ],
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["vue"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: "Vue",
        },
      },
    },
  };
});
