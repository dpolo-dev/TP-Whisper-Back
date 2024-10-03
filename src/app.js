import "dotenv/config";
import express from "express";
import cors from "cors";
import roomRoutes from "./routes/roomRoutes.js";
import tokenRoutes from "./routes/tokenRoutes.js";
import { io } from "../server.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.get("/", (req, res) => {
  const requiredEnvVars = [
    "PORT",
    "TWILIO_API_SECRET",
    "TWILIO_API_KEY",
    "TWILIO_ACCOUNT_SID",
  ];
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  res.json({ success: true, message: "Server 🟢", missingVars });
});

app.use("/rooms", roomRoutes);
app.use("/token", tokenRoutes);

export default app;
