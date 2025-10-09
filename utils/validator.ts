import net from "node:net";
import { createClient, type RedisClientType } from "@redis/client";

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

const isUrlValid = (
  targetUrl: string
): Promise<{ success: boolean; message: string }> => {
  if (targetUrl.includes("http://") || targetUrl.includes("https://")) {
    return new Promise((resolve) =>
      resolve({
        success: false,
        message:
          "Do not include the protocol ('http://' or 'https://') in the URL)",
      })
    );
  }
  return new Promise((resolve) => {
    const host = targetUrl;
    const port = 80;

    // create a tcp connection
    const socket = net.createConnection(port, host, () => {
      // if the url is reached
      resolve({ success: true, message: "Valid!" });
      socket.end();
    });

    socket.on("error", (e) => {
      // if there is an error in reaching the url
      resolve({ success: false, message: "URL is not valid!" });
    });

    socket.on("timeout", () => {
      // if timeout occurs while reaching the url
      socket.end();
      resolve({ success: false, message: "URL is not valid!" });
    });

    socket.setTimeout(5000); // 5 seconds timeout
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
