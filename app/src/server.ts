import type { AddressInfo } from "node:net";
import http from "node:http";
import fs from "node:fs";
import esbuild from "esbuild";

async function main() {
  const port = Number(process.env.PORT ?? "8080");
  const apiUrl = process.env.QUOT_API_URL || "http://localhost:3000/";
  const publicDir = __dirname;
  const htmlPath = `${publicDir}/index.html`;
  const scriptPath = `${publicDir}/index.ts`;

  const result = await esbuild.serve(
    {
      host: "127.0.0.1",
      servedir: publicDir,
    },
    {
      bundle: true,
      minify: true,
      entryPoints: [scriptPath],
      define: {
        "import.meta.env.QUOT_API_URL": JSON.stringify(apiUrl),
      },
    }
  );

  const handler: http.RequestListener = (req, res) => {
    const options = {
      hostname: result.host,
      port: result.port,
      path: req.url,
      method: req.method,
      headers: req.headers,
    };

    const proxyReq = http.request(options, (proxyRes) => {
      if (proxyRes.statusCode === 200) {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        fs.createReadStream(htmlPath).pipe(res);
      }
    });

    req.pipe(proxyReq);
  };

  const server = http.createServer(handler).listen(port);
  const address = server.address() as AddressInfo;

  console.log(`http://0.0.0.0:${address.port}`);
}

main();
