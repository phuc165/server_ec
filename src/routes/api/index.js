import express from 'express';
const router = express.Router();

import categoryRoutes from './category.js';
import productRoutes from './product.js';

// category route
router.use('/category', categoryRoutes);
//product route
router.use('/product', productRoutes);

export default router;
