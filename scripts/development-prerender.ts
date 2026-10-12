import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { Plugin } from "vite";

type Route = "story" | "farming" | "living" | "gallery" | "impact" | null;
const routes: Record<string, Route> = {
  "": null,
  "/about-us": "story",
  "/natural-farming": "farming",
  "/farmhouses-for-sale-in-hyderabad": "living",
  "/gallery": "gallery",
  "/involve-indulge-impact": "impact",
};
const escape = (text: string) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;");

/** Paint current source HTML before loading the development module graph. */
export function developmentPrerender(): Plugin {
  return {
    name: "render-development-pages",
    apply: "serve",
    configureServer(server) {
      server.httpServer?.once("listening", () => {
        void server.ssrLoadModule("/src/prerender.tsx").catch((error) => {
          server.config.logger.error(String(error));
        });
      });
      server.middlewares.use(async (request, response, next) => {
        const url = request.url ?? "/";
        const path = url.split("?")[0].replace(/\/$/, "");
        if (
          !(path in routes) ||
          !["GET", "HEAD"].includes(request.method ?? "GET")
        )
          return next();
        try {
          const [template, css, module] = await Promise.all([
            readFile(resolve(server.config.root, "index.html"), "utf8"),
            readFile(resolve(server.config.root, "src/styles.css"), "utf8"),
            server.ssrLoadModule("/src/prerender.tsx"),
          ]);
          const route = routes[path];
          let html = await server.transformIndexHtml(url, template);
          const metadata = module.pageMetadata[route ?? "home"];
          html = html.replace(
            /<title>.*?<\/title>/s,
            `<title>${escape(metadata.title)}</title>`,
          );
          html = html.replace(
            /<meta name="description"[^>]*\/>/,
            `<meta name="description" content="${escape(metadata.description)}"/>`,
          );
          html = html.replace(
            "</head>",
            `<link rel="canonical" href="https://www.farmnatura.in${path || "/"}"/></head>`,
          );
          html = html.replace(
            '<div id="root"></div>',
            `<div id="root">${module.render(route)}</div>`,
          );
          html = html.replace(
            "</head>",
            `<style id="development-first-paint-styles">${css}</style></head>`,
          );
          // Hash destinations must agree with the server-rendered route.
          if (route === null)
            html = html.replace(
              "<head>",
              '<head><script src="/legacy-routes.js"></script>',
            );
          response.statusCode = 200;
          response.setHeader("Content-Type", "text/html; charset=utf-8");
          response.setHeader("Cache-Control", "no-cache");
          response.end(request.method === "HEAD" ? undefined : html);
        } catch (error) {
          if (error instanceof Error) server.ssrFixStacktrace(error);
          next(error);
        }
      });
    },
  };
}
