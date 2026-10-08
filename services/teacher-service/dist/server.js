"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const database_1 = require("@edu4hub/database");
const teacher_routes_1 = __importDefault(require("./routes/teacher.routes"));
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 5003;
app.use(express_1.default.json());
app.get("/health", (_req, res) => {
    return res.status(200).json({
        success: true,
        service: "teacher-service",
        status: "healthy",
    });
});
app.use("/api/v1/teachers", teacher_routes_1.default);
const startServer = async () => {
    try {
        await (0, database_1.connectDatabase)();
        app.listen(PORT, () => {
            console.log(`🚀 Teacher Service running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("❌ Failed to start Teacher Service");
        console.error(error);
        process.exit(1);
    }
};
startServer();
