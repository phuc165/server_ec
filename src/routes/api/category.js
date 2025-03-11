import express from 'express';
import { createItem, getAllItems, getItemById, updateItem, deleteItem } from '../../app/controllers/categoryController.js';

const router = express.Router();

router.post('/', createItem);
router.get('/', getAllItems);
router.get('/:id', getItemById);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

export default router;
