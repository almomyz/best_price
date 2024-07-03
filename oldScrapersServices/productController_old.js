import Product from "./Product.js";

const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addProduct = async (req, res) => {
    const { name, url } = req.body;
    try {
        const product = new Product({ name, url, prices: [] });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Function to search for products by name
const searchProductsByName = async (req, res) => {
    const { productName } = req.query;

    try {
        // Use a regular expression to perform a case-insensitive search
        const regex = new RegExp(productName, 'i');
        const products = await Product.find({ productName: regex }).sort({ price: 1 });

        res.status(200).json(products);
    } catch (error) {
        console.error('Error searching for products:', error.message);
        res.status(500).json({ message: error.message });
    }
};

export {
    getProducts,
    addProduct,
    searchProductsByName,
}