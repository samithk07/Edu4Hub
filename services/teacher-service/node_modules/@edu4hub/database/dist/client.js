"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = exports.pool = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const mssql_1 = __importDefault(require("mssql"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({
    path: path_1.default.resolve(process.cwd(), "../../../.env"),
});
const dbConfig = {
    server: process.env.DATABASE_SERVER,
    port: Number(process.env.DATABASE_PORT),
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    options: {
        trustServerCertificate: true,
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
    },
};
exports.pool = new mssql_1.default.ConnectionPool(dbConfig);
const connectDatabase = async () => {
    if (exports.pool.connected) {
        return exports.pool;
    }
    await exports.pool.connect();
    console.log("✅ SQL Server Connected Successfully");
    return exports.pool;
};
exports.connectDatabase = connectDatabase;
