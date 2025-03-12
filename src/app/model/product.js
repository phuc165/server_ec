import { ObjectId } from 'mongodb';
import getClient from '../../connections/db.js';

class ProductModel {
    constructor() {
        this.dbName = process.env.MONGO_DB_NAME || 'your_default_db_name';
        this.collectionName = 'product';
        this.collection = null; // Initialize as null
        this.initPromise = this.initialize(); // Store the promise to reuse
    }

    async initialize() {
        try {
            const client = await getClient(); // Get the connected client
            this.db = client.db(this.dbName);
            this.collection = this.db.collection(this.collectionName);
            console.log('ProductModel initialized successfully'); // Debug log
        } catch (error) {
            console.error('Error initializing ProductModel:', error);
            throw error; // Ensure errors propagate
        }
    }

    // Ensure initialization completes before any operation
    async ensureInitialized() {
        if (!this.collection) {
            await this.initPromise; // Wait for the initial promise to resolve
        }
        if (!this.collection) {
            throw new Error('Failed to initialize collection'); // Explicitly fail if still undefined
        }
    }

    async getProducts(limit, skip, select) {
        await this.ensureInitialized(); // Replace multiple initialize calls
        try {
            let projection = {};
            if (select) {
                const fields = select.split(',');
                fields.forEach((field) => {
                    projection[field] = 1;
                });
            }
            return await this.collection.find({}, { projection }).skip(skip).limit(limit).toArray();
        } catch (err) {
            console.error('Error in getProducts model:', err);
            throw err;
        }
    }

    // get product by subcategory
    async getProductsBySubCategory(limit, skip, select, categoryName) {
        await this.ensureInitialized(); // Replace multiple initialize calls
        const query = { sub_category: categoryName };
        try {
            let projection = {};
            if (select) {
                const fields = select.split(',');
                fields.forEach((field) => {
                    projection[field] = 1;
                });
            }
            return await this.collection.find(query, { projection }).skip(skip).limit(limit).toArray();
        } catch (err) {
            console.error('Error in getProductsBySubCategory model:', err);
            throw err;
        }
    }

    // get product by best selling
    async getBestSellerProduct(limit = 10, skip = 0, select = null, filter = {}) {
        await this.ensureInitialized(); // Replace multiple initialize calls
        try {
            // Create projection object from select string if provided
            let projection = {};
            if (select) {
                const fields = select.split(',');
                fields.forEach((field) => {
                    projection[field.trim()] = 1;
                });
            }

            // Use proper MongoDB query structure
            return await this.collection
                .find(filter) // First parameter is the filter
                .project(projection) // Use project() method for projection
                .skip(skip)
                .limit(limit)
                .sort({ sales: -1 })
                .toArray();
        } catch (err) {
            console.error(`Error in getBestSellerProduct model with params: limit=${limit}, skip=${skip}, select=${select}:`, err);
            throw err;
        }
    }

    // Update other methods similarly
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

export default ProductModel;
