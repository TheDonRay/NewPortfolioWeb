import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  build: {
    // Baseline-modern output: no legacy transpilation weight in the bundle.
    target: "es2020",
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // React and the animation runtime change far less often than the site
        // does — splitting them keeps repeat visits on a warm cache. Matching
        // on the resolved path (rather than naming bare specifiers) catches
        // deep entries like react-dom/client and framer-motion's sub-packages.
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom)[\\/]/.test(id))
            return "react";
          if (/[\\/]node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/.test(id))
            return "motion";
          if (/[\\/]node_modules[\\/]lucide-react[\\/]/.test(id)) return "icons";
        },
      },
    },
  },
});
