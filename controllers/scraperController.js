import { scrapeAlmaneaProducts } from "../services/almaneaCrawleeScraper.js";
import { scrapeExtraProducts } from "../services/extraScraper.js";
import { scrapeXciteProducts } from "../services/xciteApiCrawleeScraper.js";
import { scrapeAbdulwahedProducts } from "../services/abdulwahedCrawleeScraper.js";
import { goInsert } from '../services/insertProductData .js';

const scrapeAlmanea = async (req, res) => {
    try {
        const products = await scrapeAlmaneaProducts();
        await goInsert(products);

        // insert all scraped products to database
        // const insertedProducts = await Product.insertMany(products);
        // res.status(201).json({ message: `${insertedProducts.length} products inserted successfully.` });
        res.json(products);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const scrapeExtra = async (req, res) => {
    try {
        const products = await scrapeExtraProducts();
        await goInsert(products);
        // insert all scraped products to database
        // const insertedProducts = await Product.insertMany(products);
        // res.status(201).json({ message: `${insertedProducts.length} products inserted successfully.` });
        res.json(products);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const scrapeXcite = async (req, res) => {
    try {
        const products = await scrapeXciteProducts();
        await goInsert(products);
        // insert all scraped products to database
        // const insertedProducts = await Product.insertMany(products);
        // res.status(201).json({ message: `${insertedProducts.length} products inserted successfully.` });
        res.json(products);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const scrapeAbdulwahed = async (req, res) => {
    try {
        const products = await scrapeAbdulwahedProducts();
        await goInsert(products);
        // insert all scraped products to database
        // const insertedProducts = await Product.insertMany(products);
        // res.status(201).json({ message: `${insertedProducts.length} products inserted successfully.` });
        res.json(products);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    scrapeAlmanea,
    scrapeExtra,
    scrapeXcite,
    scrapeAbdulwahed,
}
