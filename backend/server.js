import express from 'express';
import cors from 'cors';
import pool, { testConnection } from './db.js';

const app = express();
const port = 3001;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Allow larger request bodies

// A simple API endpoint to fetch all initial data
app.get('/api/data', async (req, res) => {
    try {
        // In a real application, you would have separate tables for each of these.
        // For simplicity, we'll assume a single 'store_data' table with a JSON column.
        // This is NOT a good long-term database design, but works for this transition.
        
        let [rows] = await pool.query("SELECT data FROM store_data WHERE id = 'main'");
        
        if (rows.length === 0) {
            // If no data exists, we should probably seed it, but for now return empty.
             return res.status(404).json({ message: 'No store data found.' });
        }
        
        // The 'data' column is expected to store a JSON string
        const storeData = JSON.parse(rows[0].data);
        
        res.json(storeData);

    } catch (error) {
        console.error('API Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch store data' });
    }
});

// An endpoint to create a new order
app.post('/api/orders', async (req, res) => {
    const newOrder = req.body;
    try {
        // Again, this is a simplified example. You should have a dedicated 'orders' table.
        // We're fetching the current data, adding the new order, then saving it back.
        let [rows] = await pool.query("SELECT data FROM store_data WHERE id = 'main'");
        if (rows.length === 0) {
             return res.status(404).json({ message: 'Store data not found.' });
        }
        
        const storeData = JSON.parse(rows[0].data);
        storeData.orders.unshift(newOrder); // Add to the beginning of the list

        await pool.query("UPDATE store_data SET data = ? WHERE id = 'main'", [JSON.stringify(storeData)]);

        res.status(201).json(newOrder);
    } catch (error) {
        console.error('API Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// An endpoint to update settings
app.post('/api/settings', async (req, res) => {
    const newSettings = req.body;
     try {
        let [rows] = await pool.query("SELECT data FROM store_data WHERE id = 'main'");
        if (rows.length === 0) {
             return res.status(404).json({ message: 'Store data not found.' });
        }
        
        const storeData = JSON.parse(rows[0].data);
        storeData.settings = newSettings; // Overwrite settings

        await pool.query("UPDATE store_data SET data = ? WHERE id = 'main'", [JSON.stringify(storeData)]);

        res.status(200).json(newSettings);
    } catch (error) {
        console.error('API Error updating settings:', error);
        res.status(500).json({ error: 'Failed to update settings' });
    }
});


// Start the server
app.listen(port, async () => {
  console.log(`Backend server listening at http://127.0.0.1:${port}`);
  await testConnection();
  console.log("---");
  console.log("IMPORTANT: If the connection failed, make sure your MySQL server is running and the credentials in 'backend/.env' are correct.");
  console.log("You may need to create the database and table manually.");
  console.log("Example SQL to get started:");
  console.log("CREATE DATABASE IF NOT EXISTS jaryaDB;");
  console.log("USE jaryaDB;");
  console.log("CREATE TABLE store_data (id VARCHAR(10) PRIMARY KEY, data JSON);");
  console.log("INSERT INTO store_data (id, data) VALUES ('main', '{\\\"products\\\": [], \\\"orders\\\": []}'); -- Seed with initial JSON structure");
  console.log("---");
});
