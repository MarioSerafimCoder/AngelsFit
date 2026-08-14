import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const rootDirectory = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: path.join(rootDirectory, "native"),
  publicDir: path.join(rootDirectory, "public"),
  base: "./",
  plugins: [react()],
  build: {
    outDir: path.join(rootDirectory, "native-dist"),
    emptyOutDir: true,
    target: "es2022",
    minify: "esbuild",
  },
});
