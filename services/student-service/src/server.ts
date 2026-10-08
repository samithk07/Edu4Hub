import dotenv from "dotenv";

dotenv.config();

import express from "express";

import { connectDatabase } from "@edu4hub/database";
import studentRoutes from "./routes/student.routes";

const app = express();

const PORT = Number(process.env.PORT) || 5004;

app.use(express.json());

app.get("/health", (_req, res) => {
  return res.status(200).json({
    success: true,
    service: "student-service",
    status: "healthy",
  });
});

app.use(
  "/api/v1/students",
  studentRoutes
);

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(
        `🚀 Student Service running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "❌ Failed to start Student Service"
    );
    console.error(error);

    process.exit(1);
  }
};

startServer();