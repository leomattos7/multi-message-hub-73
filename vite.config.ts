import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api": {
        target:
          "https://2suwazl6jc.execute-api.sa-east-1.amazonaws.com/serveless_health_prod",
        changeOrigin: true,
        secure: false,
        headers: {
          "x-uuid": "123",
        },
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            console.log("Enviando requisição para:", req.method, req.url);
            proxyReq.setHeader("x-uuid", "123");
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log(
              "Recebendo resposta de:",
              req.method,
              req.url,
              proxyRes.statusCode
            );
          });
        },
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
