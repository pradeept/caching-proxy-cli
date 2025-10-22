#!/usr/bin/env bun

// Options
/*
    1) --port: on which the proxy server will run
    2) --origin <url> : is the actual server to which requests will be forwarded.
    3) --redis: redis url with port <hostname:port>
    4) --clear: flush all stored cache
*/

import { isUrlValid, validatePort } from "./utils/validator";
import { createSpinner } from "nanospinner";
import { proxyServer } from "./services/proxyService";
import { cli } from "./cli";
import { redis } from "./configs/redis";
import { Cache } from "./services/cacheService";

const program = cli();

const app = async () => {
  const options = program.opts();
  const PORT: string = options.port;
  const DESTINATION_URL: string = options.url;
  const REDIS_HOST: string = options.redis.split(":")[0];
  const REDIS_PORT: string = options.redis.split(":")[1];
  const CLEAR_CACHE: true | undefined = options.clear;

  // spinner
  const validationSpinner = createSpinner("Validating the arguments").start();

  // validate the port
  const { success, message } = await validatePort(PORT);
  if (!success) {
    validationSpinner.error({ text: message });
    return;
  }
  // validate the url
  const result = await isUrlValid(DESTINATION_URL);
  if (!result.success) {
    validationSpinner.error({ text: result.message });
    return;
  }

  // create a redis connection
  const redisClient = await redis(REDIS_HOST, REDIS_PORT);
  if (!redisClient) {
    validationSpinner.error("Falied to connect to the redis server :(");
    return;
  } else {
    validationSpinner.success({ text: "Redis client connected!" });
  }

  // create cache store
  const cacheStore = new Cache(redisClient);

  // clear cache if --clear is specified
  if(CLEAR_CACHE){
    const isCleared = await cacheStore.flushKeys()
    if(isCleared)
      console.log("Cached data cleared successfully!");
    else
      console.log("Failed to clear the cached data :(")
  }

  // start the proxy server
  await proxyServer(PORT, DESTINATION_URL, cacheStore);

  // redis connection cleanup (important)
  process.on("SIGINT", () => {
    try {
      redisClient?.destroy();
      console.log("Redis client disconnected!");
      process.exit(0);
    } catch (e) {
      console.log("Failed to disconnect the redis client :(");
      process.exit(1);
    }
  });
};

app();
