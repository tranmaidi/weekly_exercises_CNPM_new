import express, { Application } from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from "./config/configdb";
import dotenv from "dotenv";

// Load biến môi trường từ .env
dotenv.config();

const app: Application = express();

// config middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// config view engine & routes
viewEngine(app);
initWebRoutes(app);

// connect DB
connectDB();

// Lấy port từ .env hoặc mặc định = 6969
const port: number = Number(process.env.PORT) || 6969;

// chạy server
app.listen(port, () => {
  console.log(`Backend Nodejs is running on the port : ${port}`);
});
