import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        sidepanel: path.resolve(__dirname, 'src/extension/sidepanel.html'),
        background: path.resolve(__dirname, 'src/extension/background.ts'),
        content: path.resolve(__dirname, 'src/extension/content.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'background' || chunkInfo.name === 'content') {
            return `[name].js`;
          }
          return `assets/[name]-[hash].js`;
        },
      }
    },
  },
}));
