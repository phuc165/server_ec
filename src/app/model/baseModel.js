import { ObjectId } from 'mongodb';
import getClient from '../../connections/db.js';

class BaseModel {
    constructor(collectionName) {
        this.dbName = process.env.MONGO_DB_NAME || 'your_default_db_name';
        this.collectionName = collectionName;
        this.collection = null;
        this.initPromise = this._initialize();
    }

    async _initialize() {
        try {
            const client = await getClient(); // Get the connected client
            this.db = client.db(this.dbName);
            this.collection = this.db.collection(this.collectionName);
            console.log(`${this.constructor.name} initialized with collection: ${this.collectionName}`);
            return this.collection;
        } catch (error) {
            console.error(`Error initializing ${this.constructor.name}:`, error);
            throw error;
        }
    }

    async ensureInitialized() {
        if (!this.collection) {
            await this.initPromise;
        }
        if (!this.collection) {
            throw new Error(`Failed to initialize collection: ${this.collectionName}`);
        }
    }

    // Common CRUD operations that all models will inherit
    async create(data) {
        await this.ensureInitialized();
        try {
            const result = await this.collection.insertOne(data);
            return result;
        } catch (error) {
            console.error('Error creating item:', error);
            throw error;
        }
    }

    async getAll() {
        await this.ensureInitialized();
        try {
            const items = await this.collection.find({}).toArray();
            return items;
        } catch (error) {
            console.error('Error getting all items:', error);
            throw error;
        }
    }

    async getById(id) {
        await this.ensureInitialized();
        try {
            const item = await this.collection.findOne({ _id: new ObjectId(id) });
            return item;
        } catch (error) {
            console.error('Error getting item by ID:', error);
            throw error;
        }
    }

    async update(id, data) {
        await this.ensureInitialized();
        try {
            const result = await this.collection.updateOne({ _id: new ObjectId(id) }, { $set: data });
            return result;
        } catch (error) {
            console.error('Error updating item:', error);
            throw error;
        }
    }

    async delete(id) {
        await this.ensureInitialized();
        try {
            const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
            return result;
        } catch (error) {
            console.error('Error deleting item:', error);
            throw error;
        }
    }
}

export default BaseModel;
