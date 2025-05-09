import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      manifest: {
        name: "movies-recommandation-app",
        short_name: "movie-app",
        start_url: "/",
        background_color: "#ffffff",
        theme_color: "#000000",
        icons: [
          
        ],
      },
      workbox: {
        // defining cached files formats
        globPatterns: ["**/*.{js,ts,css,html,ico,png,jpg,svg,webmanifest}"],
        cleanupOutdatedCaches: false
      },
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
    }),
  ],
});
