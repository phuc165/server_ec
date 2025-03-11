const { MongoClient } = require('mongoDB');
const { BSON } = require('mongoDB');
const ObjectID = BSON.ObjectID;

class Todo {
    static client;
    static db;
    static collection;
    static connectionPromise;

    static {
        this.connectionPromise = (async () => {
            const url = 'mongodb://localhost:27017/';
            this.client = new MongoClient(url);
            await this.client.connect();
            this.db = this.client.db('mydatabase');
            this.collection = this.db.collection('todos');
        })();
    }

    static async create(todoData) {
        await this.connectionPromise;
        await this.collection.insertOne(todoData);
    }

    static async findAll() {
        await this.connectionPromise;
        return await this.collection.find({}).toArray();
    }

    static async getById(id) {
        await this.connectionPromise;
        return await this.collection
            .find({ _id: new ObjectID(id) })
            .limit(1)
            .next();
    }

    static async updateById(id, updates) {
        await this.connectionPromise;
        await this.collection.updateOne({ _id: new ObjectID(id) }, { $set: updates });
    }

    static async deleteById(id) {
        await this.connectionPromise;
        await this.collection.deleteOne({ _id: new ObjectID(id) });
    }
}

module.exports = Todo;
