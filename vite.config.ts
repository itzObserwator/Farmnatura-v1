import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { gzipSync } from "node:zlib";
import deployment from "./vercel.json" with { type: "json" };
import storyHeroImages from "./src/data/storyHeroImages.json" with { type: "json" };
import { developmentPrerender } from "./scripts/development-prerender";
export default defineConfig({
  ssr: { noExternal: ["gsap"] },
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
      name: "preload-development-story-art",
      apply: "serve",
      transformIndexHtml(_html, context) {
        if (
          (context.originalUrl ?? context.path)
            .split("?")[0]
            .replace(/\/$/, "") !== "/about-us"
        )
          return;
        return storyHeroImages.scenes.map((name) => ({
          tag: "link",
          attrs: {
            rel: "preload",
            as: "image",
            type: "image/avif",
            fetchpriority: "high",
            imagesrcset: storyHeroImages.widths
              .map(
                (width) =>
                  `/illustrations/hero-scenes/${name}-${width}.avif ${width}w`,
              )
              .join(", "),
            imagesizes: storyHeroImages.sizes,
          },
          injectTo: "head" as const,
        }));
      },
    },
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
    developmentPrerender(),
    {
      name: "prerendered-clean-urls",
      configurePreviewServer(server) {
        server.middlewares.use((req, res, next) => {
          for (const { key, value } of deployment.headers[0].headers)
            res.setHeader(key, value);
          const pathname = (req.url ?? "/").split("?")[0].replace(/\/$/, "");
          if (
            !/^\/(about-us|natural-farming|farmhouses-for-sale-in-hyderabad|gallery|involve-indulge-impact)$/.test(
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
