import express from 'express';
import {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUserAddresses,
    addUserAddress,
    updateUserAddress,
    deleteUserAddress,
} from '../../app/controllers/userController.js';
import { protect } from '../../app/middleware/authMiddleware.js';

const router = express.Router();

router.post('/', registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/profile/addresses').get(protect, getUserAddresses).post(protect, addUserAddress);
router.route('/profile/addresses/:addressId').put(protect, updateUserAddress).delete(protect, deleteUserAddress);

export default router;
