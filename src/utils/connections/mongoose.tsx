import mongoose, { Mongoose } from "mongoose";

let MongoDB_URL: string | undefined = process.env.MONGODB_URL;
type MongooseConnection = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

let cached: MongooseConnection = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

const ConnectToDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }
  if (!MongoDB_URL) {
    return null;
  }
  cached.promise =
    cached.promise ||
    mongoose.connect(MongoDB_URL, {
      dbName: "jobinformation",
    });

  cached.conn = await cached.promise;
  console.log("connected to DB");
  return cached.conn;
};
export default ConnectToDB;
