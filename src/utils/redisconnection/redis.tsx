import type { RedisClientType } from "redis";
import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_CONNECTION_URL,
});
export const connecttoRedis = async (): Promise<boolean> => {
  try {
    await redisClient.connect();
    console.log("successfully connected to redis");
    return true;
  } catch (err) {
    return false;
    console.log("failed connecting to redis");
  }
};

export default redisClient;
