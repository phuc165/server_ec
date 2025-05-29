import BaseModel from './baseModel.js';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

// Helper function for comparing attribute objects
function areAttributesEqual(attr1, attr2) {
    if (!attr1 || !attr2) return false; // Handle cases where attributes might be null or undefined
    const keys1 = Object.keys(attr1);
    const keys2 = Object.keys(attr2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (const key of keys1) {
        // Ensure the key exists in attr2 and values are the same
        if (!Object.prototype.hasOwnProperty.call(attr2, key) || attr1[key] !== attr2[key]) {
            return false;
        }
    }
    return true;
}

class UserModel extends BaseModel {
    constructor() {
        if (UserModel.instance) {
            return UserModel.instance;
        }
        super('users');
        UserModel.instance = this;
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
                addresses: [],
                cart: [], // Initialize cart array
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

    // Address methods
    async addAddress(userId, addressData) {
        const addressId = new ObjectId();
        const address = { _id: addressId, ...addressData };
        const result = await this.collection.updateOne({ _id: new ObjectId(userId) }, { $push: { addresses: address } });
        if (result.matchedCount === 0) throw new Error('User not found');
        return address;
    }

    async updateAddress(userId, addressId, addressData) {
        const address = { _id: new ObjectId(addressId), ...addressData };
        const result = await this.collection.updateOne(
            { _id: new ObjectId(userId), 'addresses._id': new ObjectId(addressId) },
            { $set: { 'addresses.$': address } },
        );
        if (result.matchedCount === 0) throw new Error('Address not found');
        return address;
    }

    async deleteAddress(userId, addressId) {
        const result = await this.collection.updateOne({ _id: new ObjectId(userId) }, { $pull: { addresses: { _id: new ObjectId(addressId) } } });
        if (result.matchedCount === 0) throw new Error('Address not found');
    }

    // Cart methods
    async addToCart(userId, cartItem) {
        await this.ensureInitialized();
        try {
            const user = await this.findById(userId);
            if (!user) throw new Error('User not found');

            // Ensure cart is initialized
            user.cart = user.cart || [];

            const existingItemIndex = user.cart.findIndex(
                (item) => item.productId === cartItem.productId && areAttributesEqual(item.attributes, cartItem.attributes),
            );

            if (existingItemIndex > -1) {
                user.cart[existingItemIndex].quantity += cartItem.quantity;
            } else {
                user.cart.push(cartItem);
            }

            await this.updateUser(userId, { cart: user.cart });
            return user.cart;
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    }

    async updateCartItemQuantity(userId, productId, attributes, quantity) {
        await this.ensureInitialized();
        try {
            const user = await this.findById(userId);
            if (!user) throw new Error('User not found');

            const itemIndex = user.cart.findIndex((item) => item.productId === productId && areAttributesEqual(item.attributes, attributes));

            if (itemIndex > -1 && quantity >= 1) {
                user.cart[itemIndex].quantity = quantity;
                await this.updateUser(userId, { cart: user.cart });
                return user.cart;
            } else {
                throw new Error('Cart item not found or invalid quantity');
            }
        } catch (error) {
            console.error('Error updating cart item quantity:', error);
            throw error;
        }
    }

    async removeFromCart(userId, productId, attributes) {
        await this.ensureInitialized();
        try {
            const user = await this.findById(userId);
            if (!user) throw new Error('User not found');

            user.cart = user.cart.filter((item) => !(item.productId === productId && areAttributesEqual(item.attributes, attributes)));

            await this.updateUser(userId, { cart: user.cart });
            return user.cart;
        } catch (error) {
            console.error('Error removing from cart:', error);
            throw error;
        }
    }

    async clearCart(userId) {
        await this.ensureInitialized();
        try {
            await this.updateUser(userId, { cart: [] });
            return [];
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw error;
        }
    }

    async getCart(userId) {
        await this.ensureInitialized();
        try {
            const user = await this.findById(userId);
            if (!user) throw new Error('User not found');
            return user.cart;
        } catch (error) {
            console.error('Error getting cart:', error);
            throw error;
        }
    }
}

export default UserModel;
