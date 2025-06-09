import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js'; // Adjust path if necessary

const protect = asyncHandler(async (req, res, next) => {
    let token;

    console.log('Auth Middleware: Attempting to authenticate request for:', req.path);
    console.log('Auth Middleware: Cookies received:', req.cookies);

    if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
        console.log('Auth Middleware: JWT found in cookies:', token);
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Auth Middleware: JWT decoded successfully:', decoded);
            req.user = await User.findById(decoded.userId).select('-password');
            if (!req.user) {
                console.error('Auth Middleware: User not found for decoded ID:', decoded.userId);
                res.status(401);
                throw new Error('Not authorized, user not found');
            }
            console.log('Auth Middleware: User attached to request:', req.user._id);
            next();
        } catch (error) {
            console.error('Auth Middleware: JWT verification failed. Error:', error.message);
            console.error('Auth Middleware: Token that failed:', token);
            console.error('Auth Middleware: JWT_SECRET used (length check):', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 'NOT SET');
            res.status(401);
            // Provide a more specific error message if possible
            if (error.name === 'JsonWebTokenError') {
                throw new Error('Not authorized, token failed verification (JsonWebTokenError)');
            } else if (error.name === 'TokenExpiredError') {
                throw new Error('Not authorized, token expired (TokenExpiredError)');
            } else {
                throw new Error('Not authorized, token failed');
            }
        }
    } else {
        console.log('Auth Middleware: No JWT found in cookies.');
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

export { protect };
