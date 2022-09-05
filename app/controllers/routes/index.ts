import type { FastifyInstance } from "fastify";
import api from "./api";
import login from "./login";
import views from "./views";

async function index(fastify: FastifyInstance) {
  await Promise.all([
    fastify.register(api),
    fastify.register(login),
    fastify.register(views),
  ]);
}

export default index;
