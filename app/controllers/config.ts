import type { HttpOptions } from "openid-client";
import crypto, { type KeyObject } from "node:crypto";

interface Config {
  port: number;
  apiUrl: URL;
  apiEndpoint: string;
  viewsDir: string;
  rootUrl: URL;
  openid: {
    issuer: string;
    client: {
      client_id: string;
      client_secret: string;
    };
    request: HttpOptions;
  };
  key: KeyObject;
}

export type { Config };

function defaultConfig(): Config {
  const port = Number(process.env.PORT ?? "8080");
  const rootUrl = new URL(
    process.env.QUOT_ROOT_URL ?? `http://localhost:${port}/`
  );
  return {
    port,
    rootUrl,
    apiUrl: new URL(process.env.QUOT_API_URL ?? "http://127.0.0.1:3000"),
    apiEndpoint: process.env.QUOT_API_ENDPOINT ?? "/api",
    viewsDir: "views",
    openid: {
      issuer: process.env.QUOT_OPENID_ISSUER ?? "",
      client: {
        client_id: process.env.QUOT_OPENID_CLIENT_ID ?? "",
        client_secret: process.env.QUOT_OPENID_CLIENT_SECRET ?? "",
      },
      request: { timeout: 5_000 },
    },
    key: crypto.createPrivateKey({
      key: JSON.parse(process.env.QUOT_JWK ?? "{}"),
      format: "jwk",
    }),
  };
}

export default defaultConfig;
