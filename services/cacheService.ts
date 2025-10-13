import type { RedisClientType } from "@redis/client";

export class Cache {
  private client;
  constructor(client: RedisClientType) {
    this.client = client;
  }

  async getKey(key: string) {
    const value = await this.client.GET(key);
    if (!value) {
      return null;
    } else {
      return value;
    }
  }

  async setKey(key: string, value: string) {
    try {
      await this.client.SET(key, value, {
        expiration: { type: "EX", value: 60 },
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  async flushKeys(){
    try{
        await this.client.FLUSHALL("ASYNC");
        return true;
    }catch(e){
        return false;
    }
  }
}
