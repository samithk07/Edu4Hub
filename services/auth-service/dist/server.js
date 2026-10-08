"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const database_1 = require("@edu4hub/database");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 5001;
// Middleware
app.use(express_1.default.json());
// Health check
app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        service: "auth-service",
        status: "healthy",
    });
});
// Auth routes
app.use("/api/v1/auth", auth_routes_1.default);
app.use("/api/v1/auth", auth_routes_1.default);
app.use("/api/v1/admins", admin_routes_1.default);
// Start server
const startServer = async () => {
    try {
        await (0, database_1.connectDatabase)();
        app.listen(PORT, () => {
            console.log(`🚀 Auth Service running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("❌ Failed to start Auth Service");
        console.error(error);
        process.exit(1);
    }
};
startServer();
