import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { gzipSync } from "node:zlib";
export default defineConfig({
  resolve: {
    alias: [{ find: /^lucide-react$/, replacement: resolve("src/icons.ts") }],
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom/client",
      "framer-motion",
      "gsap",
      "gsap/ScrollTrigger",
      "gsap/Observer",
      "gsap/CustomEase",
      "lenis",
    ],
    rolldownOptions: { output: { minify: true } },
  },
  plugins: [
    react(),
    {
      name: "compress-development-text",
      configureServer(server) {
        // Keep dependency maps available to DevTools without embedding them in every script.
        const dependencyMaps = new Map<string, Buffer>();
        server.middlewares.use((req, res, next) => {
          if (req.url?.startsWith("/__dependency-maps__/")) {
            const map = dependencyMaps.get(req.url);
            if (!map) return next();
            res.setHeader("Content-Type", "application/json");
            res.end(map);
            return;
          }
          if (!req.headers["accept-encoding"]?.includes("gzip")) return next();
          const end = res.end;
          res.end = function (
            this: typeof res,
            chunk?: unknown,
            encodingOrCallback?: unknown,
            callback?: unknown,
          ) {
            const contentType = String(res.getHeader("Content-Type") ?? "");
            if (
              !res.headersSent &&
              /javascript/.test(contentType) &&
              req.url?.includes("/node_modules/.vite/deps/") &&
              (typeof chunk === "string" || Buffer.isBuffer(chunk))
            ) {
              const mapUrl =
                "/__dependency-maps__/" + encodeURIComponent(req.url) + ".map";
              chunk = String(chunk).replace(
                /\/\/# sourceMappingURL=data:application\/json(?:;charset=utf-8)?;base64,([A-Za-z0-9+/=]+)/g,
                (_match, encoded: string) => {
                  dependencyMaps.set(mapUrl, Buffer.from(encoded, "base64"));
                  return "//# sourceMappingURL=" + mapUrl;
                },
              );
            }
            if (
              !res.headersSent &&
              !res.getHeader("Content-Encoding") &&
              /javascript|css|html|json/.test(contentType) &&
              (typeof chunk === "string" || Buffer.isBuffer(chunk))
            ) {
              res.setHeader("Content-Encoding", "gzip");
              res.setHeader("Vary", "Accept-Encoding");
              res.removeHeader("Content-Length");
              const done =
                typeof encodingOrCallback === "function"
                  ? encodingOrCallback
                  : callback;
              return end.call(
                this,
                gzipSync(chunk),
                "utf8",
                done as (() => void) | undefined,
              );
            }
            return end.call(
              this,
              chunk,
              encodingOrCallback as BufferEncoding,
              callback as (() => void) | undefined,
            );
          } as typeof res.end;
          next();
        });
      },
    },
    {
      name: "prerendered-clean-urls",
      configurePreviewServer(server) {
        server.middlewares.use((req, res, next) => {
          const pathname = (req.url ?? "/").split("?")[0].replace(/\/$/, "");
          if (
            !/^\/(about-us|natural-farming|farmhouses-for-sale-in-hyderabad|gallery)$/.test(
              pathname,
            )
          )
            return next();
          const file = resolve("dist", pathname.slice(1), "index.html");
          if (!existsSync(file)) return next();
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          const html = readFileSync(file);
          if (req.headers["accept-encoding"]?.includes("gzip")) {
            res.setHeader("Content-Encoding", "gzip");
            res.setHeader("Vary", "Accept-Encoding");
            res.end(gzipSync(html));
          } else res.end(html);
        });
      },
    },
  ],
});
