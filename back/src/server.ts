import express from "express";
import morgan from "morgan";
import cors from "cors";
import routerr from "./routes";

const server = express();

server.use(morgan("dev"));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors());
server.use(routerr);

export default server;