import type { FastifyInstance } from "fastify";
import httpProxy from "@fastify/http-proxy";

async function api(fastify: FastifyInstance) {
  await fastify.register(httpProxy, {
    prefix: "/api",
    upstream: fastify.config.apiUrl.href,
  });
}

export default api;
