import { createClient, type RedisClientType } from "@redis/client";

let client: RedisClientType | null = null;

export const redis = async (
  hostname: string,
  port: string
): Promise<RedisClientType | null> => {
  // check if the client already exists
  if (client && client.isOpen) {
    return client;
  }

  //if client is null, create a client
  client = createClient({ url: `redis://${hostname}:${port}` });

  // connect to the client
  try {
    await client.connect();
    return client;
  } catch (e) {
    return null;
  }
};
