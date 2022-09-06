import { custom, Issuer } from "openid-client";
import { SignJWT } from "jose";
import type { FastifyInstance } from "fastify";

async function login(fastify: FastifyInstance) {
  const key = fastify.config.key;
  if (!key) {
    fastify.log.warn("The key is required to use login endpoint.");
    return;
  }
  const openid = fastify.config.openid;
  if (!openid) {
    fastify.log.warn(
      "The openid parameters is required to use login endpoint."
    );
    return;
  }
  custom.setHttpOptionsDefaults(openid.request);
  const issuer = await Issuer.discover(openid.issuer);
  const client = new issuer.Client(openid.client);

  fastify.get("/login", async (request, reply) => {
    const params = client.callbackParams(request.raw);
    const redirect_uri = new URL("login", fastify.config.rootUrl).href;
    if (!("code" in params)) {
      const authorizationUrl = client.authorizationUrl({ redirect_uri });
      return reply.redirect(authorizationUrl);
    }
    const tokens = await client.callback(redirect_uri, params);
    const userUrl = new URL(issuer.metadata.issuer);
    const userinfo = await client.userinfo(tokens);
    userUrl.username = userinfo.sub;
    const jwt = await new SignJWT({ role: "writer" })
      .setProtectedHeader({ typ: "JWT", alg: "RS256" })
      .setExpirationTime("30days")
      .setSubject(userUrl.href)
      .sign(key);
    const url = new URL(fastify.config.rootUrl);
    url.hash = new URLSearchParams({ jwt }).toString();
    return reply.redirect(url.href);
  });
}

export default login;
