import { Command } from "commander";

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
