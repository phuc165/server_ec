// src/connections/db.js - Fixed version
import { MongoClient } from 'mongodb';

const URI = process.env.MONGO_URI;
const client = new MongoClient(URI);

// Use a promise to ensure we only connect once
let connectionPromise = null;

async function connect() {
    try {
        await client.connect();
        console.log('Connected successfully to MongoDB server');
        return client; // Return the connected client
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

// Export a function to get the client, ensuring it's connected
export default async function getClient() {
    // If we don't have a connection promise yet, create one
    if (!connectionPromise) {
        connectionPromise = connect();
    }
    // Return the result of the connection promise
    return connectionPromise;
}
