import fastify, { type FastifyInstance } from "fastify";
import defaultConfig, { type Config } from "./config";
import routes from "./routes/index";

declare module "fastify" {
  interface FastifyInstance {
    config: Config;
  }
}

export function App(config: Config = defaultConfig()): FastifyInstance {
  const app = fastify({ logger: true });
  app.decorate("config", config).register(routes);
  return app;
}

export async function start(app: FastifyInstance): Promise<string> {
  await app.ready();
  const address = await app.listen({ host: "::", port: app.config.port });
  return address;
}
