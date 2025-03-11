// src/connections/db.js
import { MongoClient } from 'mongodb';

const URI = process.env.MONGO_URI;
const client = new MongoClient(URI);

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
let dbClient = null;
export default async function getClient() {
    if (!dbClient) {
        dbClient = await connect();
    }
    return dbClient;
}
