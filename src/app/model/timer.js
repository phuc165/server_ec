// src/app/model/category.js
import { ObjectId } from 'mongodb';
import getClient from '../../connections/db.js';

class TimerModel {
    constructor() {
        this.dbName = process.env.MONGO_DB_NAME || 'your_default_db_name';
        this.collectionName = 'category';
        this.initialize(); // Call async initialization
    }

    async initialize() {
        try {
            const client = await getClient(); // Get the connected client
            this.db = client.db(this.dbName);
            this.collection = this.db.collection(this.collectionName);
        } catch (error) {
            console.error('Error initializing TimerModel:', error);
            throw error;
        }
    }

    async getTimelines(timerName) {
        try {
            await this.initialize();
            const timelines = await this.db.collection('timelines').find({ timerName }).sort({ createdAt: -1 }).toArray();
            return timelines;
        } catch (error) {
            console.error('Error fetching timelines:', error);
            throw error;
        }
    }

    async createTimeline(timelineData) {
        try {
            await this.initialize();
            const timeline = {
                ...timelineData,
                createdAt: new Date(),
                status: 'active',
            };
            const result = await this.db.collection('timelines').insertOne(timeline);
            return { ...timeline, _id: result.insertedId };
        } catch (error) {
            console.error('Error creating timeline:', error);
            throw error;
        }
    }

    async getAll() {
        await this.initialize();
        try {
            const items = await this.collection.find({}).toArray();
            return items;
        } catch (error) {
            console.error('Error getting all items:', error);
            throw error;
        }
    }

    async getById(id) {
        await this.initialize();
        try {
            const item = await this.collection.findOne({ _id: new ObjectId(id) });
            return item;
        } catch (error) {
            console.error('Error getting item by ID:', error);
            throw error;
        }
    }

    async update(id, data) {
        await this.initialize();
        try {
            const result = await this.collection.updateOne({ _id: new ObjectId(id) }, { $set: data });
            return result;
        } catch (error) {
            console.error('Error updating item:', error);
            throw error;
        }
    }

    async delete(id) {
        await this.initialize();
        try {
            const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
            return result;
        } catch (error) {
            console.error('Error deleting item:', error);
            throw error;
        }
    }
}

export default TimerModel;
