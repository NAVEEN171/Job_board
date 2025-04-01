import ConnectToDB from "@/utils/connections/mongoose";
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
  // console.log("the token key is ");
  // console.log(tokenKey);
  let redisConn = await connecttoRedis();
  let EXPIRY_TIME = 60 * 15;
  let newData;
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
  newData = { ...storedData };
  // console.log("Stored token data:", newData);
};
interface returnType {
  message: string;
  valid: boolean;
  user?: userData;
}
export const verifyAndConsumeToken = async (token: string) => {
  const tokenKey = `token:${token}`;
  let redisConn = await connecttoRedis();
  let storedData;
  // console.log("redis conn is", redisConn);
  if (!redisConn) {
    return { message: "couldnt connect to redis", valid: false };
  }
  const exists = await redisClient.exists(tokenKey);
  // console.log(`exists=${exists}`);

  if (exists) {
    storedData = await redisClient.hGetAll(tokenKey);
    await redisClient.del(tokenKey);
  }

  if (!storedData) {
    return {
      message: "your verification time has expired! Please Signup again",
      valid: false,
    };
  }
  let newData: any = { ...storedData };
  newData.savedJobs = [];
  let emailKey = `email:${newData.email}`;
  let emailexist = await redisClient.exists(emailKey);
  if (emailexist) {
    await redisClient.del(emailKey);
  }

  // Delete token to prevent reuse
  // await Redisclient.del(tokenKey);

  delete newData.createdAt;
  const dbConn = await ConnectToDB();
  if (!dbConn) {
    return {
      message: "failed connecting to db",
      valid: false,
    };
  }
  if (dbConn) {
    const userscollection = dbConn.connection.collection("users");
    const insertPerson = await userscollection.insertOne(newData);
    // console.log(insertPerson);

    if (insertPerson.acknowledged) {
      let exisitinguser = await userscollection.findOne({
        email: newData.email,
      });
      if (exisitinguser) {
        delete newData.password;
        return {
          message: "successfully added to database",
          valid: true,
          user: newData,
        };
      }
    }
    // console.log(newData);
    return {
      message: "something went wrong",
      valid: false,
    };
  }
};
