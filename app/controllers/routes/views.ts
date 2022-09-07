import type { FastifyInstance } from "fastify";
import httpProxy from "@fastify/http-proxy";
import esbuild from "esbuild";

async function views(fastify: FastifyInstance) {
  const viewsDir = fastify.config.viewsDir;
  const entryPoint = `${viewsDir}/index.ts`;
  const { host, port } = await esbuild.serve(
    {
      host: "127.0.0.1",
      servedir: viewsDir,
    },
    {
      bundle: true,
      minify: process.env.NODE_ENV !== "development",
      entryPoints: [entryPoint],
      define: {
        "import.meta.env.QUOT_API_ENDPOINT": JSON.stringify(
          fastify.config.apiEndpoint
        ),
      },
    }
  );

  await fastify.register(httpProxy, {
    upstream: `http://${host}:${port}`,
    async preHandler(req) {
      if (!/\.(?:html|css|js)$/.test(req.url)) req.raw.url = "/";
    },
  });
}

export default views;
