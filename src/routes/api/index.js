import express from 'express';
const router = express.Router();

import categoryRoutes from './category.js';
import productRoutes from './product.js';
import timerRoutes from './timer.js';
// category route
router.use('/category', categoryRoutes);
//product route
router.use('/product', productRoutes);
//timer route
router.use('/timer', timerRoutes);

export default router;
