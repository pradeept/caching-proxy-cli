import { Command } from "commander";

// Options
/*
    1) --port: on which the proxy server will run
    2) --origin <url> : is the actual server to which requests will be forwarded.
    3) --redis: redis url with port <hostname:port>
    4) --clear: flush all stored cache
*/

export const cli = () => {
  const program = new Command();

  program
    .name("caprox")
    .description(
      "A CLI proxy server with caching capablity.\nAuthor: Pradeep Tarakar(https://pradeept.dev)."
    )
    .version("1.0.0");

  // set options
  program
    .requiredOption("-P, --port <number>", "Port for proxy server")
    .requiredOption(
      "-U, --url <URL>",
      "URL of the server to which requests are forwarded"
    )
    .requiredOption(
      "-R, --redis <hostname:port>",
      "Provide the redis <hostname:port>"
    )
    .option("-C, --clear", "Clear cached responses");

  program.parse();
  return program;
};
