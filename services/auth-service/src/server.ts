import dotenv from "dotenv";
dotenv.config();

import express from "express";

import { connectDatabase } from "@edu4hub/database";
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
const app = express();

const PORT = Number(process.env.PORT) || 5001;

// Middleware
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    service: "auth-service",
    status: "healthy",
  });
});

// Auth routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/admins", adminRoutes);
// Start server
const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Auth Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start Auth Service");
    console.error(error);
    process.exit(1);
  }
};

startServer();