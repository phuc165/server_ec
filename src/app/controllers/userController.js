import asyncHandler from 'express-async-handler';
import UserModel from '../model/userModel.js';
import generateToken from '../utils/generateToken.js';

const userModel = new UserModel();

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (user && (await userModel.matchPassword(user._id, password))) {
        generateToken(res, user._id);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await userModel.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await userModel.createUser({
        name,
        email,
        password,
    });

    if (user) {
        generateToken(res, user._id);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

const getUserProfile = asyncHandler(async (req, res) => {
    const user = await userModel.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await userModel.findById(req.user._id);

    if (user) {
        const updateData = {
            name: req.body.name || user.name,
            email: req.body.email || user.email,
        };

        if (req.body.password) {
            updateData.password = req.body.password;
        }

        await userModel.updateUser(user._id, updateData);
        const updatedUser = await userModel.findById(user._id);

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

const getUserAddresses = asyncHandler(async (req, res) => {
    const user = await userModel.findById(req.user._id);
    if (user) {
        res.json(user.addresses || []);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

const addUserAddress = asyncHandler(async (req, res) => {
    const addressData = req.body;
    const newAddress = await userModel.addAddress(req.user._id, addressData);
    res.status(201).json(newAddress);
});

const updateUserAddress = asyncHandler(async (req, res) => {
    const addressData = req.body;
    const updatedAddress = await userModel.updateAddress(req.user._id, req.params.addressId, addressData);
    res.json(updatedAddress);
});

const deleteUserAddress = asyncHandler(async (req, res) => {
    await userModel.deleteAddress(req.user._id, req.params.addressId);
    res.json({ message: 'Address deleted' });
});

// Cart controller functions
const getUserCart = asyncHandler(async (req, res) => {
    const cart = await userModel.getCart(req.user._id);
    res.json(cart);
});

const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity, attributes, productData } = req.body;
    if (!productId || !quantity || quantity < 1) {
        res.status(400);
        throw new Error('Invalid cart item data');
    }
    // Ensure productData is included, defaulting to an empty object if not provided
    const cartItem = { productId, quantity, attributes: attributes || {}, productData: productData || {} };
    const updatedCart = await userModel.addToCart(req.user._id, cartItem);
    res.status(201).json(updatedCart);
});

const updateCartItemQuantity = asyncHandler(async (req, res) => {
    const { productId, attributes, quantity } = req.body;
    if (!productId || !quantity || quantity < 1) {
        res.status(400);
        throw new Error('Invalid quantity');
    }
    const updatedCart = await userModel.updateCartItemQuantity(req.user._id, productId, attributes || {}, quantity);
    res.json(updatedCart);
});

const removeFromCart = asyncHandler(async (req, res) => {
    const { productId, attributes } = req.body;
    if (!productId) {
        res.status(400);
        throw new Error('Product ID is required');
    }
    const updatedCart = await userModel.removeFromCart(req.user._id, productId, attributes || {});
    res.json(updatedCart);
});

const clearCart = asyncHandler(async (req, res) => {
    const clearedCart = await userModel.clearCart(req.user._id);
    res.json(clearedCart);
});

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUserAddresses,
    addUserAddress,
    updateUserAddress,
    deleteUserAddress,
    getUserCart,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
};
