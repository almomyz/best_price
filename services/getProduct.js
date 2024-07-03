import { Op } from 'sequelize';
import Product from '../models/Product.js'; // adjust the import based on your project structure
import Brand from '../models/Brand.js';
import Category from '../models/Category.js';
import ProductPhotos from '../models/ProductPhotos.js';
import ProductSpecifications from '../models/ProductSpecifications.js';
import ProductPrice from '../models/ProductPrice.js';
import Store from '../models/Store.js';
import Currency from '../models/Currency.js'
async function getAllData() {
    try {
        // Fetch all Products with associated Category and Brand
        const products = await Product.findAll({
            include: [
                { model: Category },
                { model: Brand },
                { model: ProductPhotos },
                { model: ProductPrice, include: [Currency, Store] },
                { model: ProductSpecifications }
            ]
        });
        console.log("Products: ", JSON.stringify(products, null, 2));

        // Fetch all Brands
        const brands = await Brand.findAll();
        console.log("Brands: ", JSON.stringify(brands, null, 2));

        // Fetch all Categories with subcategories
        const categories = await Category.findAll({
            include: [{ model: Category, as: 'Subcategories' }]
        });
        console.log("Categories: ", JSON.stringify(categories, null, 2));

        // Fetch all Currencies
        const currencies = await Currency.findAll();
        console.log("Currencies: ", JSON.stringify(currencies, null, 2));

        // Fetch all Product Photos
        const productPhotos = await ProductPhotos.findAll();
        console.log("Product Photos: ", JSON.stringify(productPhotos, null, 2));

        // Fetch all Product Prices with associated Product, Currency, and Store
        const productPrices = await ProductPrice.findAll({
            include: [Product, Currency, Store]
        });
        console.log("Product Prices: ", JSON.stringify(productPrices, null, 2));

        // Fetch all Product Specifications with associated Product
        const productSpecifications = await ProductSpecifications.findAll({
            include: [Product]
        });
        console.log("Product Specifications: ", JSON.stringify(productSpecifications, null, 2));

        // Fetch all Stores
        const stores = await Store.findAll();
        console.log("Stores: ", JSON.stringify(stores, null, 2));

    } catch (error) {
        console.error("Error fetching data: ", error);
    }
}

getAllData();
