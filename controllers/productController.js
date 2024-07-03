import Brand from "../models/Brand.js";
import Category from "../models/Category.js";
import Currency from "../models/Currency.js";
import Product from "../models/Product.js";
import ProductPhotos from "../models/ProductPhotos.js";
import ProductPrice from "../models/ProductPrice.js";
import ProductSpecifications from "../models/ProductSpecifications.js";
import Store from "../models/Store.js";
import { filterProductsPage } from "../services/filterProducts.js";
import { Op } from "sequelize";

const filterProducts = async (req, res) => {
    try {
        const dd = await filterProductsPage(req);

        res.json(dd);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// get all categories using mysql2 and sequelize
const getCategories = async (req, res) => {
    try {
        // Get all categories and their subcategories, including subcategories of subcategories
        const categories = await Category.findAll({
            where: {
                Parent_Category_ID: null,
            },
            include: [
                {
                    model: Category,
                    as: "SubcategoriesLevel1",
                    include: [
                        {
                            model: Category,
                            as: "SubcategoriesLevel2",
                        },
                    ],
                },
            ],
        });
        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// get all stores
const getStores = async (req, res) => {
    try {
        const stores = await Store.findAll();
        res.status(200).json(stores);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// get all brands for given category
const getBrands = async (req, res) => {
    try {
        const brands = await Brand.findAll();
        res.status(200).json(brands);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// get product detail
const getProductById = async (req, res) => {
    try {
        // const product = await Product.findByPk(req.params.id, {
        const product = await Product.findOne({
            where: {
                id: req.params.id,
                Available: true,
            },
            include: [
                { model: Category, attributes: ["id", "Name"] },
                { model: Brand, attributes: ["id", "Name", "Image"] },
                { model: ProductPhotos, attributes: ["Photo_URL"] },
                {
                    model: ProductPrice,
                    attributes: [
                        "Price",
                        "WasPrice",
                        "Discount",
                        "CreatedAt",
                        "UpdatedAt",
                    ],
                    include: [
                        { model: Currency, attributes: ["Name"] },
                        { model: Store, attributes: ["Name", "Logo"] },
                    ],
                },
                {
                    model: ProductSpecifications,
                    attributes: ["Specification_Key", "Specification_Value"],
                },
            ],
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        // res.status(500).json({ message: 'Internal server error' });
        res.status(500).json({ message: error.message });
    }
};

const getProducts = async (req, res) => {
    try {
        // Destructuring and default values for query parameters
        const {
            priceRange = null,
            mainCategories = [],
            subCategories = [],
            brands = [],
            stores = [],
            search = "",
            page = 1,
            limit = 10,
            sortBy = "id",
            order = "ASC",
        } = req.query;

        console.log(req.query);

        // Sanitize and validate input parameters
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const offset = (pageNum - 1) * limitNum;

        // Initialize where clauses
        let whereClause = {};
        let priceWhereClause = {};
        let categoryWhereClause = {};

        // Main categories filter
        if (mainCategories.length > 0) {
            categoryWhereClause.Parent_Category_ID = {
                [Op.in]: mainCategories.map(Number),
            };
        }

        // Sub categories filter
        if (subCategories.length > 0) {
            whereClause.Category_ID = { [Op.in]: subCategories.map(Number) };
        }

        // Search filter
        if (search) {
            whereClause.Name = { [Op.like]: `%${search}%` };
        }

        // Brands filter
        if (brands.length > 0) {
            whereClause.Brand_ID = { [Op.in]: brands.map(Number) };
        }

        // Available filter
        whereClause.Available = true;

        // Price range filter
        if (priceRange) {
            priceWhereClause.Price = { [Op.between]: priceRange.map(Number) };
        }

        // Stores filter
        if (stores.length > 0) {
            priceWhereClause.Store_ID = { [Op.in]: stores.map(Number) };
        }

        // Get total count before applying pagination
        const totalProducts = await Product.count({
            include: [
                {
                    model: ProductPrice,
                    where: priceWhereClause,
                    include: [
                        {
                            model: Store,
                            where:
                                stores.length > 0
                                    ? { id: { [Op.in]: stores.map(Number) } }
                                    : {},
                        },
                    ],
                },
                {
                    model: Category,
                    as: "Category",
                    attributes: [],
                    where:
                        mainCategories.length > 0
                            ? {
                                  Parent_Category_ID: {
                                      [Op.in]: mainCategories.map(Number),
                                  },
                              }
                            : {},
                },
            ],
            where: whereClause,
        });

        const products = await Product.findAll({
            attributes: ["id", "Name", "Category_ID", "Brand_ID"],
            include: [
                { model: ProductPhotos, attributes: ["Photo_URL"] },
                {
                    model: ProductPrice,
                    attributes: ["Price", "WasPrice", "Discount"],
                    include: [
                        { model: Currency, attributes: ["Name"] },
                        { model: Store, attributes: ["Name", "Logo"] },
                    ],
                    where: priceWhereClause,
                },
                {
                    model: Category,
                    where: categoryWhereClause,
                },
            ],
            where: whereClause,
            order: [[{ model: ProductPrice }, sortBy, order]],
            limit: limitNum,
            offset: offset,
        });

        res.json({ total: totalProducts, products: products });
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).send("Server Error");
    }
};

export {
    filterProducts,
    getCategories,
    getStores,
    getProductById,
    getProducts,
    getBrands,
};
