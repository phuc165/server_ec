import express from 'express';
import {
    createItem,
    getProducts,
    getProductsBySubCategory,
    getBestSellerProduct,
    getAllItems,
    getItemById,
    updateItem,
    deleteItem,
} from '../../app/controllers/productController.js';

const router = express.Router();

router.post('/', createItem);
// router.get('/', getAllItems);
router.get('/', getProducts);
router.get('/bestSeller', getBestSellerProduct);
router.get('/:categoryName', getProductsBySubCategory);
router.get('/:id', getItemById);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

export default router;
