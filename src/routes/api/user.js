import express from 'express';
import { authUser, registerUser, logoutUser, getUserProfile, updateUserProfile } from '../../app/controllers/userController.js';
import { protect } from '../../app/middleware/authMiddleware.js';

const router = express.Router();

router.post('/', registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

export default router;
