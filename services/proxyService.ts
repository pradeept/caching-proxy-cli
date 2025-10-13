import type { RedisClientType } from "@redis/client";
import axios from "axios";
import express from "express";
import type { Cache } from "./cacheService";

export const proxyServer = async (
  port: string,
  destination: string,
  cache: Cache
) => {
  const app = express();

  app.use(express.json());

  app.use(express.urlencoded({ extended: true }));

  app.get("/", async (req, res) => {
    const value = await cache.getKey(req.route.path);
    console.log(value);
    if (value) {
      res.setHeader("X-Cache", "HIT");
      return res.status(200).send(value);
    }
    try {
      const response = await axios.get(destination);
      await cache.setKey(req.route.path, JSON.stringify(response.data))
      res.setHeader("X-Cache", "MISS");
      res.status(response.status).send(response.data);
    } catch (e) {
        console.error(e);
      res.setHeader("X-Cache", "MISS");
      return res.status(500).send("Something went wrong!");
    }
  });

  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
};
