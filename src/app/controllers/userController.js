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

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
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

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
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

        const result = await userModel.updateUser(user._id, updateData);
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
//address
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
};
