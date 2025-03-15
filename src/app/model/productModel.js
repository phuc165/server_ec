import BaseModel from './baseModel.js';

class ProductModel extends BaseModel {
    constructor() {
        super('product');
    }

    async getProducts(limit, skip, select) {
        await this.ensureInitialized();
        try {
            let projection = {};
            if (select) {
                const fields = select.split(',');
                fields.forEach((field) => {
                    projection[field.trim()] = 1;
                });
            }
            return await this.collection.find({}, { projection }).skip(skip).limit(limit).toArray();
        } catch (err) {
            console.error('Error in getProducts model:', err);
            throw err;
        }
    }

    async getProductsBySubCategory(limit, skip, select, categoryName) {
        await this.ensureInitialized();
        const query = { sub_category: categoryName };
        try {
            let projection = {};
            if (select) {
                const fields = select.split(',');
                fields.forEach((field) => {
                    projection[field.trim()] = 1;
                });
            }
            return await this.collection.find(query, { projection }).skip(skip).limit(limit).toArray();
        } catch (err) {
            console.error('Error in getProductsBySubCategory model:', err);
            throw err;
        }
    }

    async getBestSellerProduct(limit = 10, skip = 0, select = null, filter = {}) {
        await this.ensureInitialized();
        try {
            let projection = {};
            if (select) {
                const fields = select.split(',');
                fields.forEach((field) => {
                    projection[field.trim()] = 1;
                });
            }

            return await this.collection.find(filter).project(projection).skip(skip).limit(limit).sort({ sales: -1 }).toArray();
        } catch (err) {
            console.error(`Error in getBestSellerProduct model:`, err);
            throw err;
        }
    }
}

export default ProductModel;
