import { Op } from 'sequelize';
import Product from '../models/Product.js'; // adjust the import based on your project structure
import Brand from '../models/Brand.js';
import Category from '../models/Category.js';
import ProductPhoto from '../models/ProductPhotos.js';
import ProductSpecification from '../models/ProductSpecifications.js';
import ProductPrice from '../models/ProductPrice.js';
import Store from '../models/Store.js';
import Currency from '../models/Currency.js';

export const filterProductsPage = async (req) => {
    const { minPrice, maxPrice, category, brand, store, name } = req.query;

    // Parse the brand, store, and category parameters as arrays
    const brandIds = brand ? brand.split(',').map(id => parseInt(id)) : [];
    const storeIds = store ? store.split(',').map(id => parseInt(id)) : [];
    const categoryIds = category ? category.split(',').map(id => parseInt(id)) : [];

    // Fetch all child categories if any parent categories are provided
    let allCategoryIds = [];
    if (categoryIds.length) {
        const childCategories = await Category.findAll({
            where: {
                [Op.or]: [
                    { id: { [Op.in]: categoryIds } },
                    { Parent_Category_ID: { [Op.in]: categoryIds } }
                ]
            },
            attributes: ['id']
        });
        allCategoryIds = childCategories.map(cat => cat.id);
    }

    // Build the where conditions for filtering
    const whereConditions = {};

    if (allCategoryIds.length) {
        whereConditions.Category_ID = { [Op.in]: allCategoryIds };
    }

    if (name) {
        whereConditions.name = { [Op.like]: `%${name}%` };
    }

    // Construct the Sequelize query with associations and filters
    const products = await Product.findAll({
        where: whereConditions,
        include: [
            {
                model: Brand,
                where: brandIds.length ? { id: { [Op.in]: brandIds } } : {},
                attributes: { exclude: [] } // fetch all attributes
            },
            {
                model: Category,
                where: allCategoryIds.length ? { id: { [Op.in]: allCategoryIds } } : {},
                attributes: { exclude: [] } // fetch all attributes
            },
            {
                model: ProductPhoto,
                attributes: { exclude: [] } // fetch all attributes
            },
            {
                model: ProductPrice,
                where: {
                    ...(minPrice && { price: { [Op.gte]: minPrice } }),
                    ...(maxPrice && { price: { [Op.lte]: maxPrice } })
                },
                include: [
                    {
                        model: Currency,
                        attributes: { exclude: [] } // fetch all attributes
                    },
                    {
                        model: Store,
                        where: storeIds.length ? { id: { [Op.in]: storeIds } } : {},
                        attributes: { exclude: [] } // fetch all attributes
                    }
                ],
                attributes: { exclude: [] } // fetch all attributes
            },
            {
                model: ProductSpecification,
                attributes: { exclude: [] } // fetch all attributes
            }
        ],
        attributes: { exclude: [] } // fetch all attributes for the main model
    });

    return products;
};
