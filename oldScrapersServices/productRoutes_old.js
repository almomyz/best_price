import express from "express";
import { getProducts, addProduct, searchProductsByName } from "./productController_old.js"

const router = express.Router();

router.get("/", getProducts);
router.post("/", addProduct);
router.get('/search', searchProductsByName);

export default router;