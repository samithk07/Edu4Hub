"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const database_1 = require("@edu4hub/database");
const student_routes_1 = __importDefault(require("./routes/student.routes"));
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 5004;
app.use(express_1.default.json());
app.get("/health", (_req, res) => {
    return res.status(200).json({
        success: true,
        service: "student-service",
        status: "healthy",
    });
});
app.use("/api/v1/students", student_routes_1.default);
const startServer = async () => {
    try {
        await (0, database_1.connectDatabase)();
        app.listen(PORT, () => {
            console.log(`🚀 Student Service running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("❌ Failed to start Student Service");
        console.error(error);
        process.exit(1);
    }
};
startServer();
