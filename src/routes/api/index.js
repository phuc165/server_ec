import express from 'express';
const router = express.Router();

import categoryRoutes from './category.js';
import productRoutes from './product.js';
import timerRoutes from './timer.js';
import userRoutes from './user.js';
import paymentRouter from './payment.js'; // Import the new payment router

// category route
router.use('/category', categoryRoutes);

//product route
router.use('/product', productRoutes);

//timer route
router.use('/timer', timerRoutes);

//user route
router.use('/user', userRoutes);

// payment route
router.use('/payment', paymentRouter); // Use the payment router

export default router;
