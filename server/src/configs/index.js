import dotenv from "dotenv";
dotenv.config();
import { s3 } from "./aws.js";

const mongoConfig = {
  connectionUrl: process.env.MONGO_URI,
};

const serverConfig = {
  ip: "127.0.0.1",
  port: 8080,
  //   port: process.env.PORT || 9000,
};

const jwtTokenSecret = process.env.SECRET_ACCESS_KEY;

export { mongoConfig, serverConfig, jwtTokenSecret, s3 };
