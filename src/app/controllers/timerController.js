// controllers/itemController.js
import TimerModel from '../model/timerModel.js';

const itemModel = new TimerModel(); // Instantiate the model

export const getTimerByName = async (req, res) => {
    try {
        const itemName = req.params.timerName; // Get item ID from request parameters
        const item = await itemModel.getTimelines(itemName);

        const timelineData = item.map((timeline) => ({
            id: timeline._id,
            title: timeline.title,
            startTime: timeline.startTime, // ISO date string
            endTime: timeline.endTime, // ISO date string
            status: timeline.status,
            createdAt: timeline.createdAt,
        }));
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
            data: timelineData,
        });
    } catch (error) {
        console.error('Error in getTimerByName controller:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve item',
            error: error.message || 'Internal Server Error',
        });
    }
};

export const createTimeline = async (req, res) => {
    try {
        const timelineData = {
            userId: req.body.userId,
            title: req.body.title,
            startTime: new Date(req.body.startTime),
            endTime: new Date(req.body.endTime),
        }; // Get item ID from request parameters
        const newTimeline = await itemModel.createTimeline(timelineData);

        if (!newTimeline) {
            // If item not found, return 404 Not Found
            return res.status(404).json({
                success: false,
                message: 'Item not found',
            });
        }

        res.status(200).json({
            success: true,
            data: {
                id: newTimeline._id,
                title: newTimeline.title,
                startTime: newTimeline.startTime,
                endTime: newTimeline.endTime,
                status: newTimeline.status,
                createdAt: newTimeline.createdAt,
            },
            message: 'Item retrieved successfully',
        });
    } catch (error) {
        console.error('Error in getTimerByName controller:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve item',
            error: error.message || 'Internal Server Error',
        });
    }
};

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
