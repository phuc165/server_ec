import express from 'express';
import {
    createItem,
    getProducts,
    getProductsBySubCategory,
    getBestSellerProduct,
    getFlashSaleProduct,
    getAllItems,
    getItemById,
    updateItem,
    deleteItem,
    getRelatedProducts,
} from '../../app/controllers/productController.js';

const router = express.Router();

router.post('/', createItem);
router.get('/', getProducts);
router.get('/bestSeller', getBestSellerProduct);
router.get('/flashSale', getFlashSaleProduct);
router.get('/:id([0-9a-fA-F]{24})', getItemById);
router.get('/related/:id', getRelatedProducts);
router.get('/subcategory/:categoryName', getProductsBySubCategory);
router.put('/:id([0-9a-fA-F]{24})', updateItem);
router.delete('/:id([0-9a-fA-F]{24})', deleteItem);
export default router;
