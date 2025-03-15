import BaseModel from './baseModel.js';

class CategoryModel extends BaseModel {
    constructor() {
        super('category'); // Pass the collection name to the parent constructor
    }

    async create(data) {
        await this.ensureInitialized(); // Ensure ensureInitializedd
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

export default CategoryModel;
