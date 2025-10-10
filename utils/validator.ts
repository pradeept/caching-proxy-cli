import net from "node:net";
import { createClient, type RedisClientType } from "@redis/client";
import https from "node:https";
import http from "node:http";
import url from "node:url";

const validatePort = async (
  port: string
): Promise<{ success: boolean; message: string }> => {
  // check if the port is valid
  const result = await isPortAvailable(Number(port));
  if (result) {
    return { success: true, message: "Valid" };
  }

  return { success: false, message: `Port ${port} is already in use!` };
};

const isPortAvailable = async (port: number): Promise<boolean> => {
  return new Promise((resolve) => {
    let s = net.createServer();
    s.once("error", (err) => {
      console.log(err);
      s.close();
      // @ts-ignore
      if (err.code == "EADDRINUSE") {
        resolve(false);
      } else {
        resolve(false);
      }
    });
    s.once("listening", () => {
      resolve(true);
      s.close();
    });
    s.listen(port);
  });
};

const isUrlValid = async (
  targetUrl: string
): Promise<{ success: boolean; message: string }> => {
  const parsedUrl = url.parse(targetUrl);
  if (!parsedUrl.host || !parsedUrl.protocol || !parsedUrl.slashes) {
    return {
      success: false,
      message: "Invalid URL!",
    };
  }

  // options to make a request
  const options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.protocol === "https:" ? 443 : 80,
    path: parsedUrl.path,
  };

  return new Promise((resolve) => {
    // make a request based on port
    if (options.port === 80) {
      // HTTP request
      const httpRequest = http.get(options, (r) => {
        resolve({
          success: r.statusCode === 200,
          message: r.statusMessage!,
        });
      });

      httpRequest.on("error", (_) => {
        resolve({ success: false, message: "Given URL is not reachable!" });
      });

      httpRequest.end();
    } else {
      // HTTPS request
      const httpsRequest = https.get(options, (r) => {
        resolve({
          success: r.statusCode === 200,
          message: r.statusMessage!,
        });
      });

      httpsRequest.on("error", (_) => {
        resolve({ success: false, message: "Given URL is not reachable!" });
      });

      httpsRequest.end();
    }
  });
};

const isRedisAvailable = async (
  hostname: string,
  port: string
): Promise<{ success: boolean; message: string; client?: RedisClientType }> => {
  //create a client
  const client = createClient({ url: `redis://${hostname}:${port}` });
  // connect to the client
  try {
    await client.connect();
    return { success: true, message: "Connected!", client };
  } catch (e) {
    return { success: false, message: "Failed to connect to redis!" };
  }
};

export { validatePort, isUrlValid, isRedisAvailable };
