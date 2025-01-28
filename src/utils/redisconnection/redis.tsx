import {
  createClient,
  type RedisClientType,
  type RedisClientOptions,
} from "redis";

type RedisClient = RedisClientType<
  Record<string, never>,
  Record<string, never>
>;

declare global {
  var redisClient: RedisClient | null;
}

const redisClient: RedisClient = createClient({
  url: process.env.REDIS_CONNECTION_URL,
}) as RedisClient;

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
  global.redisClient = null;
});

export const connecttoRedis = async (): Promise<boolean> => {
  try {
    if (redisClient.isOpen) {
      return true;
    }

    await redisClient.connect();
    global.redisClient = redisClient;
    console.log("Successfully connected to Redis");
    return true;
  } catch (err) {
    console.error("Failed connecting to Redis:", err);
    global.redisClient = null;
    return false;
  }
};

export default redisClient;
