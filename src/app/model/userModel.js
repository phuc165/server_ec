import BaseModel from './baseModel.js';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

class UserModel extends BaseModel {
    constructor() {
        super('users');
    }

    async findOne(query) {
        await this.ensureInitialized();
        try {
            const user = await this.collection.findOne(query);
            return user;
        } catch (error) {
            console.error('Error finding user:', error);
            throw error;
        }
    }

    async findById(id) {
        await this.ensureInitialized();
        try {
            const user = await this.collection.findOne({ _id: new ObjectId(id) });
            return user;
        } catch (error) {
            console.error('Error finding user by ID:', error);
            throw error;
        }
    }

    async createUser(userData) {
        await this.ensureInitialized();
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userData.password, salt);

            const newUser = {
                name: userData.name,
                email: userData.email,
                password: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const result = await this.collection.insertOne(newUser);
            return { ...newUser, _id: result.insertedId };
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    async updateUser(id, userData) {
        await this.ensureInitialized();
        try {
            const updateData = {
                ...userData,
                updatedAt: new Date(),
            };

            if (userData.password) {
                const salt = await bcrypt.genSalt(10);
                updateData.password = await bcrypt.hash(userData.password, salt);
            }

            const result = await this.collection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
            return result;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    async matchPassword(userId, enteredPassword) {
        await this.ensureInitialized();
        try {
            const user = await this.findById(userId);
            if (!user) return false;
            return await bcrypt.compare(enteredPassword, user.password);
        } catch (error) {
            console.error('Error matching password:', error);
            throw error;
        }
    }
}

export default UserModel;
