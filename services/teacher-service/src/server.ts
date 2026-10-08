import dotenv from "dotenv";

dotenv.config();

import express from "express";

import { connectDatabase } from "@edu4hub/database";

import teacherRoutes from "./routes/teacher.routes";

const app = express();

const PORT = Number(process.env.PORT) || 5003;

app.use(express.json());

app.get("/health", (_req, res) => {
  return res.status(200).json({
    success: true,
    service: "teacher-service",
    status: "healthy",
  });
});

app.use(
  "/api/v1/teachers",
  teacherRoutes
);

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(
        `🚀 Teacher Service running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "❌ Failed to start Teacher Service"
    );

    console.error(error);

    process.exit(1);
  }
};

startServer();