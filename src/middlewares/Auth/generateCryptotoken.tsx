import redisClient from "@/utils/redisconnection/redis";
import { connecttoRedis } from "@/utils/redisconnection/redis";

import crypto from "crypto";
import type { RedisClientType } from "redis";
import { createClient } from "redis";
interface userData {
  username: string;
  profilephoto: string;
  provider: string;
  email: string;
  password: string;
}

interface TokenData extends userData {
  createdAt?: Date;
}

export const generateToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const storeToken = async (token: string, user: userData) => {
  const tokenKey = `token:${token}`;
  let redisConn = await connecttoRedis();
  let EXPIRY_TIME = 60 * 15;
  if (redisConn) {
    await redisClient
      .multi()
      .hSet(tokenKey, "email", user.email)
      .hSet(tokenKey, "profilephoto", user.profilephoto)
      .hSet(tokenKey, "username", user.username)
      .hSet(tokenKey, "provider", user.provider)
      .hSet(tokenKey, "createdAt", new Date().toISOString())
      .hSet(tokenKey, "password", user.password)
      .expire(tokenKey, EXPIRY_TIME)
      .exec();
  }
  const storedData = await redisClient.hGetAll(tokenKey);
  const newData = { ...storedData };
  console.log("Stored token data:", newData);
};
export const verifyAndConsumeToken = async (token: string) => {
  const tokenKey = `token:${token}`;
  let redisConn = await connecttoRedis();
  let storedData;
  if (!redisConn) {
    return false;
  }
  const exists = await redisClient.exists(tokenKey);
  console.log(`exists=${exists}`);
  if (exists) {
    storedData = await redisClient.hGetAll(tokenKey);
    await redisClient.del(tokenKey);
  }

  if (!storedData) {
    return false;
  }

  // Delete token to prevent reuse
  // await Redisclient.del(tokenKey);
  const newData = { ...storedData };
  delete newData.createdAt;

  return newData;
};
