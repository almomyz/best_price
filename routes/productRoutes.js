import express from "express";
import { filterProducts, getCategories, getStores, getProductById, getProducts, getBrands } from "../controllers/productController.js";

const router = express.Router();

router.get('/filter', filterProducts);
// to get all categories
router.get('/categories', getCategories);
// to get all store
router.get('/stores', getStores);

// to get all brand of products in the given category
// getBrandsByCategory
router.get('/brands', getBrands);

// to get product detail
router.get('/:id', getProductById);

router.get('/', getProducts);

export default router;