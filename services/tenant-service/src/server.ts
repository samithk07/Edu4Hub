import dotenv from "dotenv";
dotenv.config();

import express from "express";

import { connectDatabase } from "@edu4hub/database";
import centerRoutes from "./routes/center.routes";

const app = express();

const PORT = Number(process.env.PORT) || 5002;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    service: "tenant-service",
    status: "healthy",
  });
});

app.use("/api/v1/centers", centerRoutes);

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(
        `🚀 Tenant Service running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "❌ Failed to start Tenant Service"
    );
    console.error(error);

    process.exit(1);
  }
};

startServer();