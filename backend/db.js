import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: './backend/.env' });

let pool;

/**
 * Gets a memoized instance of the database connection pool.
 * On the first call, it attempts to create the pool and verify the connection.
 * Subsequent calls will return the existing pool.
 * @throws {Error} If it fails to connect to the database.
 */
export const getPool = async () => {
    if (pool) {
        return pool;
    }

    try {
        const newPool = mysql.createPool({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '3306', 10),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });

        // Test the connection to ensure credentials are valid
        const connection = await newPool.getConnection();
        connection.release();

        pool = newPool;
        console.log(`Database connection pool created and verified for database '${process.env.DB_NAME}'.`);
        return pool;
    } catch (error) {
        console.error('Failed to create database connection pool:', error.message);
        pool = null; // Ensure pool is null on failure to allow retries
        throw error; // Re-throw for the caller to handle and provide feedback
    }
};

/**
 * Closes the database connection pool if it exists.
 */
export const closePool = async () => {
    if (pool) {
        await pool.end();
        pool = null;
        console.log('Database pool closed.');
    }
};
