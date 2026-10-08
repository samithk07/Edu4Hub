import sql from "mssql";
export declare const pool: sql.ConnectionPool;
export declare const connectDatabase: () => Promise<sql.ConnectionPool>;
