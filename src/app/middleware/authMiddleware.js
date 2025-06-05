import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import UserModel from '../model/userModel.js';

// Create an instance of UserModel
const userModel = new UserModel();

const protect = asyncHandler(async (req, res, next) => {
    let token;
    token = req.cookies.jwt;
    console.log('JWT Cookie:', req.cookies.jwt);
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await userModel.findById(decoded.userId);
            if (!user) {
                throw new Error('User not found');
            }
            // Create a new object without the password
            const userWithoutPassword = { ...user };
            delete userWithoutPassword.password; // Remove password from user object
            req.user = userWithoutPassword;
            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

export { protect };
