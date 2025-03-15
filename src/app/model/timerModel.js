import BaseModel from './baseModel.js';

class TimerModel extends BaseModel {
    constructor() {
        super('timeline'); // Fixed collection name to match actual purpose
    }

    async getTimelines(timerName) {
        await this.ensureInitialized();
        try {
            const timelines = await this.db.collection('timelines').find({ timerName }).sort({ createdAt: -1 }).toArray();
            return timelines;
        } catch (error) {
            console.error('Error fetching timelines:', error);
            throw error;
        }
    }

    async createTimeline(timelineData) {
        await this.ensureInitialized();
        try {
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
}

export default TimerModel;
