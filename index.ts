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
  const URL: string = options.url;
  const REDIS_HOST: string = options.redis.split(":")[0];
  const REDIS_PORT: string = options.redis.split(":")[1];

  // spinner
  const validationSpinner = createSpinner("Validating the arguments").start();

  // validate the port
  const { success, message } = await validatePort(PORT);
  if (!success) {
    validationSpinner.error(message);
    return;
  }
  // validate the url
  const result = await isUrlValid(URL);
  if (!result.success) {
    validationSpinner.error(message);
    return;
  }

  // close the spinner with success

  const isAvailable = await isRedisAvailable(REDIS_HOST, REDIS_PORT);
  if (!isAvailable.success) {
    validationSpinner.error(isAvailable.message);
    return;
  }
  const client = isAvailable.client;

  // SOME PROMISE IS NOT RESOLVING PROPERLY
  validationSpinner.success();
};

app();
