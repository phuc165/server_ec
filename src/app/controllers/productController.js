// controllers/itemController.js
import ProductModel from '../model/productModel.js';

const itemModel = new ProductModel(); // Instantiate the model

// Controller function for creating a new item
export const createItem = async (req, res) => {
    try {
        const itemData = req.body; // Assuming request body contains item data
        const result = await itemModel.create(itemData);

        // Respond with success status and the created item's information (you might want to customize the response)
        res.status(201).json({
            success: true,
            message: 'Item created successfully',
            data: {
                insertedId: result.insertedId, // Include the inserted ID in the response
                acknowledged: result.acknowledged, // Indicate if the write was acknowledged by MongoDB
                // You might want to fetch the created item again and return it if needed for more data.
                // For now, returning just the insert result.
            },
        });
    } catch (error) {
        // Handle errors during item creation
        console.error('Error in createItem controller:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create item',
            error: error.message || 'Internal Server Error', // Provide error message from error object if available
        });
    }
};

//controller function for getting item and pagination
export const getProducts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const skip = parseInt(req.query.skip) || 0;
        const select = req.query.select;

        const items = await itemModel.getProducts(limit, skip, select);
        res.status(200).json({
            success: true,
            message: 'Items retrieved successfully',
            data: items,
        });
    } catch (error) {
        console.error('Error in getProducts controller:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve items',
            error: error.message || 'Internal Server Error',
        });
    }
};

//controller for getting product by subcategory
export const getProductsBySubCategory = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const skip = parseInt(req.query.skip) || 0;
        const select = req.query.select;
        const categoryName = req.params.categoryName;

        const items = await itemModel.getProductsBySubCategory(limit, skip, select, categoryName);
        res.status(200).json({
            success: true,
            message: 'getProductsBySubCategory retrieved successfully',
            data: items,
        });
    } catch (error) {
        console.error('Error in getProducts controller:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve items',
            error: error.message || 'Internal Server Error',
        });
    }
};

//controller for getting product by best selling
export const getBestSellerProduct = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const skip = parseInt(req.query.skip) || 0;
        const select = req.query.select;

        const items = await itemModel.getBestSellerProduct(limit, skip, select);
        res.status(200).json({
            success: true,
            message: 'getBestSellerProduct retrieved successfully',
            data: items,
        });
    } catch (error) {
        console.error('Error in getBestSellerProduct controller:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve items',
            error: error.message || 'Internal Server Error',
        });
    }
};

// Controller function for getting all items
export const getAllItems = async (req, res) => {
    try {
        const items = await itemModel.getAll();
        res.status(200).json({
            success: true,
            message: 'Items retrieved successfully',
            data: items,
        });
    } catch (error) {
        console.error('Error in getAllItems controller:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve items',
            error: error.message || 'Internal Server Error',
        });
    }
};

// Controller function for getting a single item by ID
export const getItemById = async (req, res) => {
    try {
        const itemId = req.params.id; // Get item ID from request parameters
        const item = await itemModel.getById(itemId);

        if (!item) {
            // If item not found, return 404 Not Found
            return res.status(404).json({
                success: false,
                message: 'Item not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Item retrieved successfully',
            data: item,
        });
    } catch (error) {
        console.error('Error in getItemById controller:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve item',
            error: error.message || 'Internal Server Error',
        });
    }
};

// Controller function for updating an item by ID
export const updateItem = async (req, res) => {
    try {
        const itemId = req.params.id;
        const updatedData = req.body; // Assuming request body contains updated item data

        const result = await itemModel.update(itemId, updatedData);

        if (result.modifiedCount === 0) {
            // If no document was modified, it might mean item not found or no changes
            return res.status(404).json({
                success: false,
                message: 'Item not found or no changes to update', // Clarify the message
            });
        }

        res.status(200).json({
            success: true,
            message: 'Item updated successfully',
            data: {
                modifiedCount: result.modifiedCount, // Indicate how many documents were modified
                acknowledged: result.acknowledged, // Indicate write acknowledgement
            },
        });
    } catch (error) {
        console.error('Error in updateItem controller:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update item',
            error: error.message || 'Internal Server Error',
        });
    }
};

// Controller function for deleting an item by ID
export const deleteItem = async (req, res) => {
    try {
        const itemId = req.params.id;

        const result = await itemModel.delete(itemId);

        if (result.deletedCount === 0) {
            // If no document was deleted, it likely means item was not found
            return res.status(404).json({
                success: false,
                message: 'Item not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Item deleted successfully',
            data: {
                deletedCount: result.deletedCount, // Indicate how many documents were deleted (should be 1 if successful)
                acknowledged: result.acknowledged, // Indicate write acknowledgement
            },
        });
    } catch (error) {
        console.error('Error in deleteItem controller:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete item',
            error: error.message || 'Internal Server Error',
        });
    }
};
