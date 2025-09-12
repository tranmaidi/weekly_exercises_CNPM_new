import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.tsx"), // file export chính
      name: "CartUILibrary", // tên global khi build UMD
      fileName: (format) => `cart-ui-library.${format}.js`, // tên file output
    },
    rollupOptions: {
      // tránh bundle react, react-dom vào lib
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
