#!/usr/bin/env bun

// Options
/*
    1) --port: on which the proxy server will run
    2) --origin <url> : is the actual server to which requests will be forwarded.
    3) --redis: redis url with port <hostname:port>
*/

import { Command } from "commander";
import { isRedisAvailable, isUrlValid, validatePort } from "./utils/validator";
import { createSpinner } from "nanospinner";
import http from "node:http";

const program = new Command();

program
  .name("caprox")
  .description(
    "A CLI proxy server with caching capablity.\nAuthor: Pradeep Tarakar(https://pradeept.dev)."
  )
  .version("1.0.0");

// set options
program
  .requiredOption("-p, --port <number>", "Port for proxy server")
  .requiredOption(
    "-u, --url <URL>",
    "URL of the server to which requests are forwarded"
  )
  .requiredOption(
    "-r, --redis <hostname:port>",
    "Provide the redis <hostname:port>"
  );

program.parse();

const app = async () => {
  const options = program.opts();
  const PORT: string = options.port;
  const DESTINATION_URL: string = options.url;
  const REDIS_HOST: string = options.redis.split(":")[0];
  const REDIS_PORT: string = options.redis.split(":")[1];

  // spinner
  const validationSpinner = createSpinner("Validating the arguments").start();

  // validate the port
  const { success, message } = await validatePort(PORT);
  if (!success) {
    validationSpinner.error({text:message});
    return;
  }
  // validate the url
  const result = await isUrlValid(DESTINATION_URL);
  if (!result.success) {
    validationSpinner.error({text:result.message});
    return;
  }

  const isAvailable = await isRedisAvailable(REDIS_HOST, REDIS_PORT);
  if (!isAvailable.success) {
    validationSpinner.error({text:isAvailable.message});
    return;
  }
  const client = isAvailable.client;

  // close spinner with success (check mark)
  validationSpinner.success();

  // start the proxy server
  await proxyServer("localhost", PORT, DESTINATION_URL);

  // redis connection cleanup (important)
  process.on("SIGINT", () => {
    try {
      client?.destroy();
      console.log("Redis client disconnected!");
      process.exit(0);
    } catch (e) {
      console.log("Failed to disconnect redis client!");
      process.exit(1);
    }
  });
};

app();

const proxyServer = async (
  hostaname: string,
  port: string,
  destination: string
) => {
  const server = http.createServer((client_req, client_res) => {
    let options = {
      hostaname: client_req.url,
      port: 80, //http
      path: destination,
      method: client_req.method,
      headers: client_req.headers,
    };
    const proxy = http.request(options, (res) => {
      console.log(res.statusCode);
      client_res.writeHead(res.statusCode!, res.headers);
      res.pipe(client_res, { end: true });
    });

    client_req.pipe(proxy, { end: true });
  });

  // @ts-ignore
  server.listen(Number(port), hostaname, () => {
    console.log(`- Proxy server started at http://${hostaname}:${port}`);
  });
  server.on("error", () => {
    console.error("Failed to start the proxy server!");
  });

};
